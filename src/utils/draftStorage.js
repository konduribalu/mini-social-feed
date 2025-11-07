export const saveDraft = (post) => {
    localStorage.setItem("draftPost", JSON.stringify(post));
};

export const loadDraft = () => {
    const draft = localStorage.getItem("draftPost");
    return draft ? JSON.parse(draft) : null;
};

export const clearDraft = () => {
    localStorage.removeItem("draftPost");
};

export const isDraftAvailable = () => {
    return localStorage.getItem("draftPost") !== null;
}