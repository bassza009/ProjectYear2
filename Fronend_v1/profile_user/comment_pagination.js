const commentsPerPage = 5;
let currentCommentPage = 1;

function renderCommentsWithPagination() {
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    const container = document.getElementById("commentContainer");

    const start = (currentCommentPage - 1) * commentsPerPage;
    const end = start + commentsPerPage;
    const pageComments = comments.slice(start, end);

    container.innerHTML = "";

    pageComments.forEach(c => {
        const div = document.createElement("div");
        div.className = "comment-box";
        div.innerHTML = `<b>${c.user}</b><p>${c.text}</p>`;
        container.appendChild(div);
    });

    renderCommentPagination(comments.length);
}

function renderCommentPagination(total) {
    const pagination = document.getElementById("commentPagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(total / commentsPerPage);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = "page-btn";
        if (i === currentCommentPage) btn.classList.add("active");

        btn.onclick = () => {
            currentCommentPage = i;
            renderCommentsWithPagination();
        };

        pagination.appendChild(btn);
    }
}

window.onload = renderCommentsWithPagination;
