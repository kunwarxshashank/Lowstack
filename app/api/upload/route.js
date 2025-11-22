import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { PDFDocument, PDFName, StandardFonts, rgb } from 'pdf-lib';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const userId = formData.get('userId');
    const uploadType = formData.get('uploadType') || 'document';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const maxSize = 500 * 1024 * 1024; //500 MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    const fileExtension = path.extname(file.name);
    const fileNameWithoutExt = path.basename(file.name, fileExtension);
    const timestamp = Date.now();
    const uniqueFileName = `${fileNameWithoutExt}-${timestamp}${fileExtension}`;

    const uploadDir = path.join(process.cwd(), 'uploads', uploadType);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueFileName);
    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);

    // If PDF, apply automatic edits before saving
    if (file.type === 'application/pdf') {
      try {
        const pdfDoc = await PDFDocument.load(buffer);

        // Optional logo on the first page
        const logoUrl = process.env.PDF_WATERMARK;
        let logoImage;
        try {
          const logoBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
          logoImage = await pdfDoc.embedPng(logoBytes);
        } catch (_) {
          // Ignore logo fetch failure; continue without logo
        }

        // Embed fonts
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // PRESERVE EXISTING ANNOTATIONS from all pages before inserting new page
        const existingAnnotations = pdfDoc.getPages().map(page => {
          const annots = page.node.get(PDFName.of('Annots'));
          return annots ? annots : null;
        });

        // Insert an intro page at index 0 (A4 size)
        const firstPage = pdfDoc.insertPage(0, [595, 842]);
        const { width: firstPageWidth, height: firstPageHeight } = firstPage.getSize();

        // Draw logo if available
        if (logoImage) {
          const { width: bigLogoW, height: bigLogoH } = logoImage.scale(0.4);
          const centerX = (firstPageWidth - bigLogoW) / 2;
          const centerY = (firstPageHeight - bigLogoH) / 2 + 50;
          firstPage.drawImage(logoImage, {
            x: centerX,
            y: centerY,
            width: bigLogoW,
            height: bigLogoH,
          });
        }

        // Intro texts
        const mainText = 'LOWSTACK.IN';
        const mainFontSize = 24;
        const mainTextWidth = boldFont.widthOfTextAtSize(mainText, mainFontSize);
        const centerXText = (firstPageWidth - mainTextWidth) / 2;
        const centerYText = firstPageHeight / 2 - 40;
        firstPage.drawText(mainText, {
          x: centerXText,
          y: centerYText,
          size: mainFontSize,
          font: boldFont,
          color: rgb(0.1, 0.1, 0.1),
        });

        const subText = 'Visit for more related notes !';
        const subFontSize = 14;
        const subTextWidth = regularFont.widthOfTextAtSize(subText, subFontSize);
        firstPage.drawText(subText, {
          x: (firstPageWidth - subTextWidth) / 2,
          y: centerYText - 30,
          size: subFontSize,
          font: regularFont,
          color: rgb(0.3, 0.3, 0.3),
        });

        // Make entire first page clickable to lowstack.in
        firstPage.node.set(
          PDFName.of('Annots'),
          pdfDoc.context.obj([
            pdfDoc.context.obj({
              Type: PDFName.of('Annot'),
              Subtype: PDFName.of('Link'),
              Rect: [0, 0, firstPageWidth, firstPageHeight],
              Border: [0, 0, 0],
              A: pdfDoc.context.obj({
                Type: PDFName.of('Action'),
                S: PDFName.of('URI'),
                URI: 'https://lowstack.in',
              }),
            }),
          ])
        );

        // Header on subsequent pages with clickable link
        const headerText = 'LOWSTACK.IN';
        const headerFontSize = 14;
        const marginTop = 6;
        
        pdfDoc.getPages().forEach((page, idx) => {
          if (idx === 0) return;
          
          const { width, height } = page.getSize();
          const textWidth = boldFont.widthOfTextAtSize(headerText, headerFontSize);
          const x = (width - textWidth) / 2;
          const y = height - headerFontSize - marginTop;
          
          page.drawText(headerText, {
            x,
            y,
            size: headerFontSize,
            font: boldFont,
            color: rgb(0.1, 0.1, 0.1),
          });

          // PRESERVE EXISTING ANNOTATIONS and add new link
          const existingPageAnnots = existingAnnotations[idx - 1]; // -1 because we inserted a page at beginning
          const newLinkAnnot = pdfDoc.context.obj({
            Type: PDFName.of('Annot'),
            Subtype: PDFName.of('Link'),
            Rect: [x, y, x + textWidth, y + headerFontSize + 2],
            Border: [0, 0, 0],
            A: pdfDoc.context.obj({
              Type: PDFName.of('Action'),
              S: PDFName.of('URI'),
              URI: 'https://lowstack.in',
            }),
          });

          // Merge existing annotations with new one
          if (existingPageAnnots) {
            const annotsArray = pdfDoc.context.lookup(existingPageAnnots);
            if (annotsArray && annotsArray.asArray) {
              const mergedAnnots = [...annotsArray.asArray(), newLinkAnnot];
              page.node.set(PDFName.of('Annots'), pdfDoc.context.obj(mergedAnnots));
            } else {
              page.node.set(PDFName.of('Annots'), pdfDoc.context.obj([newLinkAnnot]));
            }
          } else {
            page.node.set(PDFName.of('Annots'), pdfDoc.context.obj([newLinkAnnot]));
          }
        });

        const pdfBytes = await pdfDoc.save();
        buffer = Buffer.from(pdfBytes);
      } catch (editError) {
        console.error('PDF edit error:', editError);
        // Fallback: save original buffer if editing fails
      }
    }

    await writeFile(filePath, buffer);

    const fileUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://lowstack.in'}/uploads/${uploadType}/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      fileUrl,
      filename: uniqueFileName,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}