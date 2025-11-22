const ensureArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
};

const filterPosts = (searchText, postData) => {
  const arr = ensureArray(postData);
  const regex = new RegExp(searchText, "i");
  return arr.filter(
    (item) =>
      regex.test(item.subject_name || "") ||
      regex.test(item.course_name || "") ||
      regex.test(item.description || "") ||
      regex.test(item.file_name || "") ||
      regex.test(item.category || "") ||
      regex.test(item.title || "")
  );
};

const filterUrl = (params, postData) => {
  const arr = ensureArray(postData);
  if (params?.post?.length === 2) {
    const [postId, postTitle] = params.post;
    const regexId = new RegExp(postId, "i");
    const regexTitle = new RegExp(postTitle, "i");
    return arr.filter(
      (item) =>
        regexId.test(item.id?.toString() || "") &&
        regexTitle.test((item.title || "").replace(/\s+/g, "-"))
    );
  }
  return [];
};

const filterSyllabus = (syllabus, postData) => {
  const arr = ensureArray(postData);
  if (syllabus?.length === 2) {
    const [course, category] = syllabus;
    const regexcourse = new RegExp(course, "i");
    const regexCategory = new RegExp(category, "i");
    return arr.filter(
      (item) =>
        regexcourse.test(item.course_name || "") &&
        regexCategory.test(item.category || "")
    );
  }
  return [];
};

export { filterPosts, filterUrl, filterSyllabus };
