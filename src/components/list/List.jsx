import './list.scss'
import Card from "../card/Card"

function List({ posts }) {
    console.log("Posts recebidos:", posts);

    // Processa os posts para garantir que os dados estejam corretos
    const processedPosts = posts.map(post => {
        console.log("Processando post:", post);

        // Se o post já tem usuarioId, use-o
        if (post.usuarioId) {
            return post;
        }

        // Se não tem usuarioId mas tem usuario.id, copie para usuarioId
        if (post.usuario?.id) {
            return {
                ...post,
                usuarioId: post.usuario.id
            };
        }

        // Se nenhum dos dois existir, tente extrair do objeto
        const extractedUserId = parseInt(post.usuario?.id || post.userId || post.user_id);
        if (!isNaN(extractedUserId)) {
            return {
                ...post,
                usuarioId: extractedUserId
            };
        }

        console.warn("Post sem ID de usuário:", post);
        return post;
    });

    console.log("Posts processados:", processedPosts);

    return (
        <div className='list'>
            {processedPosts.map(item => (
                <Card key={item.id} item={item} />
            ))}
        </div>
    )
}

export default List