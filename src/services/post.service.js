import postRepositories from "../repositories/post.repositories.js";

async function createPostService({ title, banner, text }, userId) {
    if (!title || !banner || !text)
        throw new Error("Envie todos os campos para cadastro");

    const { id } = await postRepositories.createPostRepository(
        title,
        banner,
        text,
        userId
    );

    return {
        message: "Postagem criada com sucesso!",
        post: { id, title, banner, text },
    };
}

async function findAllPostsService(limit, offset, currentUrl) {
    limit = Number(limit);
    offset = Number(offset);

    if (!limit) {
        limit = 5;
    }

    if (!offset) {
        offset = 0;
    }

    const posts = await postRepositories.findAllPostsRepository(offset, limit);

    const total = await postRepositories.countPosts();

    const next = offset + limit;
    const nextUrl =
        next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl =
        previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null;

    posts.shift();

    return {
        nextUrl,
        previousUrl,
        limit,
        offset,
        total,

        results: posts.map((post) => ({
            id: post._id,
            title: post.title,
            banner: post.banner,
            text: post.text,
            likes: post.likes,
            comments: post.comments,
            name: post.user.name,
            username: post.user.username,
            avatar: post.user.avatar,
        })),
    };
}

async function topNewsService() {
    const post = await postRepositories.topNewsRepository();

    if (!post) throw new Error("Não há postagem registrada");

    return {
        post: {
            id: post._id,
            title: post.title,
            banner: post.banner,
            text: post.text,
            likes: post.likes,
            comments: post.comments,
            name: post.user.name,
            username: post.user.username,
            avatar: post.user.avatar,
        },
    };
}

async function searchPostService(title) {
    const foundPosts = await postRepositories.searchPostRepository(title);

    if (foundPosts.length === 0)
        throw new Error("Não há postagens com este título");

    return {
        foundPosts: foundPosts.map((post) => ({
            id: post._id,
            title: post.title,
            banner: post.banner,
            text: post.text,
            likes: post.likes,
            comments: post.comments,
            name: post.user.name,
            username: post.user.username,
            avatar: post.user.avatar,
        })),
    };
}

async function findPostByIdService(id) {
    const post = await postRepositories.findPostByIdRepository(id);

    if (!post) throw new Error("Postagem não encontrada");

    return {
        id: post._id,
        title: post.title,
        banner: post.banner,
        text: post.text,
        likes: post.likes,
        comments: post.comments,
        name: post.user.name,
        username: post.user.username,
        avatar: post.user.avatar,
    };
}

async function findPostsByUserIdService(id) {
    const posts = await postRepositories.findPostsByUserIdRepository(id);

    return {
        postsByUser: posts.map((post) => ({
            id: post._id,
            title: post.title,
            banner: post.banner,
            text: post.text,
            likes: post.likes,
            comments: post.comments,
            name: post.user.name,
            username: post.user.username,
            avatar: post.user.avatar,
        })),
    };
}

async function updatePostService(id, title, banner, text, userId) {
    if (!title && !banner && !text)
        throw new Error("Envie pelo menos um campo para atualizar a postagem");

    const post = await postRepositories.findPostByIdRepository(id);

    if (!post) throw new Error("Postagem não encontrada");

    if (post.user._id != userId) throw new Error("Você não criou esta postagem");

    await postRepositories.updatePostRepository(id, title, banner, text);
}

async function deletePostService(id, userId) {
    const post = await postRepositories.findPostByIdRepository(id);

    if (!post) throw new Error("Postagem não encontrada");

    if (post.user._id != userId) throw new Error("Você não criou esta postagem");

    await postRepositories.deletePostRepository(id);
}

async function likePostService(id, userId) {
    const postLiked = await postService.likesService(id, userId);

    if (postLiked.lastErrorObject.n === 0) {
        await postService.likesDeleteService(id, userId);
        return { message: "Curtida removida com sucesso" };
    }

    return { message: "Like feito com sucesso" };
}

async function commentPostService(postId, message, userId) {
    if (!message) throw new Error("Escreva uma mensagem para comentar");

    const post = await postRepositories.findPostByIdRepository(postId);

    if (!post) throw new Error("Postagem não encontrada");

    await postRepositories.commentsRepository(postId, message, userId);
}

async function commentDeletePostService(postId, userId, idComment) {
    const post = await postRepositories.findPostByIdRepository(postId);

    if (!post) throw new Error("Postagem não encontrada");

    await postRepositories.commentsDeleteRepository(postId, userId, idComment);
}

export default {
    createPostService,
    findAllPostsService,
    topNewsService,
    searchPostService,
    findPostByIdService,
    findPostsByUserIdService,
    updatePostService,
    deletePostService,
    likePostService,
    commentPostService,
    commentDeletePostService,
};