function listToTree(list, parentId = null) {
    const map = {};
    const tree = [];

    // Tạo một bản đồ (map) để truy cập nhanh từng comment theo ID
    list.forEach(item => {
        map[item._id] = { ...item._doc, children: [] };
    });

    list.forEach(item => {
        // Nếu comment có parentId và parentId đó tồn tại trong map
        if (item.comment_parentId && map[item.comment_parentId]) {
            map[item.comment_parentId].children.push(map[item._id]);
        } else {
            // Nếu không có cha (hoặc cha không nằm trong danh sách này), 
            // coi như đây là node gốc của cây kết quả
            if (item._id.toString() === parentId?.toString() || !item.comment_parentId) {
                tree.push(map[item._id]);
            }
        }
    });

    return tree;
}