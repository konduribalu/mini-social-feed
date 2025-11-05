import React, { useEffect } from "react";
import axios from "axios";

//Initial state
const initialState = {
    users: [],
    posts: [],
    searchText: "",
    filterType: "all",
    loading: true,
    error: null
};

//Reducer
function reducer(state, action) {
    switch (action.type) {
        case 'INITIALIZE':
            return {
                ...state,
                users: action.payload.users,
                posts: action.payload.posts,
                loading: false,
                error: null
            };

        case 'LIKE_POST':
            return {
                ...state,
                posts: state.posts.map(post =>
                    post.id === action.payload.postId
                        ? { ...post, likes: post.likes + 1 }
                        : post
                ),
            };

        case 'ADD_COMMENT':
            return {
                ...state,
                posts: state.posts.map(post =>
                    post.id === action.payload.postId
                        ? { ...post, comments: [...(post.comments || []), action.payload.comment] }
                        : post
                ),
            };

        case 'ADD_REPLY':
            return {
                ...state,
                posts: state.posts.map(post =>
                    post.id === action.payload.postId
                        ? {
                            ...post,
                            comments: post.comments.map(comment =>
                                comment.id === action.payload.commentId
                                    ? { ...comment, replies: [...(comment.replies || []), action.payload.reply] }
                                    : comment
                            )
                        }
                        : post
                ),
            };

        case 'ADD_POST':
            return {
                ...state,
                posts: [action.payload.post, ...state.posts],
            };

        case 'TOGGLE_FOLLOW':
            const { followerId, targetId } = action.payload;
            const isFollowing = state.users?.find(u => u.id === targetId)?.followers?.includes(followerId);
            return {
                ...state,
                users: state.users.map(user => {
                    if (user.id === targetId) {
                        return {
                            ...user,
                            followers: isFollowing
                                ? user.followers.filter(id => id !== followerId)
                                : [...user.followers, followerId],
                        };
                    }
                    if(user.id === followerId) {
                        return {
                            ...user,
                            following: isFollowing
                                ? user.following.filter(id => id !== targetId)
                                : [...user.following, targetId],
                        };
                    }
                    return user;
                }),
            };

        case 'DELETE_POST':
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.payload.postId),
            };

        case 'EDIT_POST':
            return {
                ...state,       
                posts: state.posts.map(post =>
                    post.id === action.payload.postId
                        ? { ...post, ...action.payload.post }
                        : post
                ),
            };

        case 'SET_SEARCH_TEXT':
            return {
                ...state,
                searchText: action.payload.searchText,
            };
        
        case 'SET_FILTER_TYPE':
            return {
                ...state,
                filterType: action.payload.filterType,
            };
        
        case 'UPDATE_USER':
            return {
                ...state,   
                users: state.users.map(user =>
                    user.id === action.payload.id
                        ? { ...user, ...action.payload.user }
                        : user
                ),
            };
        default:
            return state;
    }
}

//Create Context
export const GlobalContext = React.createContext();

//Provider
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    // You can add initialization logic here
    useEffect(() => {
        console.log('Hello from GlobalProvider');
        // Simulate fetching initial data
        const fetchData = async () => {
            try {
                const [usersRes, postsRes] = await Promise.all([
                    axios.get("http://localhost:5000/users"),
                    axios.get("http://localhost:5000/posts")
                ]);
                dispatch({ type: 'INITIALIZE', payload: { users: usersRes.data, posts: postsRes.data } });
            } catch (error) {
                console.error("Hello from Error");
                dispatch({ type: 'INITIALIZE', payload: { users: [], posts: [] } });
            }
        }
        fetchData();
    }, []);

    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {state.loading ? <div className="text-center p-10 text-gray-500">Loading...</div> : children}
        </GlobalContext.Provider>
    );
}
