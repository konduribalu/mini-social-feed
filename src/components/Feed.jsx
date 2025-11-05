import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { GlobalContext } from "../context/GlobalState";
import { motion } from "framer-motion";

const PostCard = lazy(() => import("./PostCard"));

const POSTS_PER_PAGE = 5;
function Feed() {
    const { state } = React.useContext(GlobalContext);
    const [followedPage, setFollowedPage] = useState(1);
    const [recommendedPage, setRecommendedPage] = useState(1);

    if (state.loading) return <p>Loading posts...</p>;

    const currentUser = state.users[0]; // Assuming the first user is the current user
    const followingIds = currentUser?.following || [];

    const feedPosts = state.posts.filter(post =>
        post.userId === currentUser.id || followingIds.includes(post.userId)
    );

    const filterType = state.filterType || "all";

    // Filter posts based on search text if provided
    const filteredFeedPostsBySearch = state.searchText
        ? feedPosts.filter(post =>
            post.content.toLowerCase().includes(state.searchText.toLowerCase()))
        : feedPosts;

    const filteredFeedPosts = filteredFeedPostsBySearch.filter(post =>
    (filterType === "all" || (filterType === "my" && post.userId === currentUser.id)
        || (filterType === "following" && followingIds.includes(post.userId))));

    const recommendedPosts = state.posts.filter(post =>
        post.userId !== currentUser.id && !followingIds.includes(post.userId)
        && (state.searchText ? post.content.toLowerCase().includes(state.searchText.toLowerCase()) : true)
    );

    if ((!filteredFeedPosts || filteredFeedPosts.length === 0)
        && (!recommendedPosts || recommendedPosts.length === 0)) {
        return <p className="text-center text-gray-600 mt-10">No posts available.</p>;
    }

    const sortedFilteredFeedPosts = useMemo(() => filteredFeedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [filteredFeedPosts]);
    const sortedRecommendedPosts = useMemo(() => recommendedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [recommendedPosts]);

    const visibleFollowedPosts = sortedFilteredFeedPosts.slice(0, followedPage * POSTS_PER_PAGE);
    const visibleRecommendedPosts = sortedRecommendedPosts.slice(0, recommendedPage * POSTS_PER_PAGE);
    
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 600) {
                console.log("Load next page");
                // Only load more if there are posts left to show
                if (visibleFollowedPosts.length < sortedFilteredFeedPosts.length) {
                    setFollowedPage(prevPage => prevPage + 1);
                } else if (visibleRecommendedPosts.length < sortedRecommendedPosts.length) {
                    setRecommendedPage(prevPage => prevPage + 1);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="max-w-2xl mx-auto mt-8 space-y-6">
            {visibleFollowedPosts.map((post) => (
                <motion.div key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}>
                        <Suspense fallback={<div>Loading post...</div>} key={post.id}>
                            <PostCard post={post} />
                        </Suspense>
                </motion.div>
            ))}
            {visibleFollowedPosts.length === sortedFilteredFeedPosts.length 
                && filterType === "all" && visibleRecommendedPosts.length > 0 && (
                <div className="recommended mt-6">
                    <h3 className="font-bold mb-2">Recommended Posts</h3>
                    {visibleRecommendedPosts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Feed;