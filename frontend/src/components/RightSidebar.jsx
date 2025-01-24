function RightSidebar() {
    const trendingTopics = [
        { id: 1, name: "#ReactJS", posts: 1200 },
        { id: 2, name: "#TailwindCSS", posts: 950 },
        { id: 3, name: "#WebDev", posts: 800 },
    ];

    const trendingPeople = [
        { id: 1, name: "John Doe", username: "@johndoe" },
        { id: 2, name: "Jane Smith", username: "@janesmith" },
        { id: 3, name: "Alice Johnson", username: "@alicej" },
    ];

    return (
        <div className="w-80 bg-base-100 p-6 border-l border-base-300">
            <h2 className="text-lg font-bold text-base-content mb-4">Trending Topics</h2>
            <div className="space-y-4">
                {trendingTopics.map((topic) => (
                    <div key={topic.id} className="flex justify-between items-center">
                        <span className="text-base-content">{topic.name}</span>
                        <span className="text-sm text-base-content opacity-70">{topic.posts} posts</span>
                    </div>
                ))}
            </div>

            <h2 className="text-lg font-bold text-base-content mt-8 mb-4">Trending People</h2>
            <div className="space-y-4">
                {trendingPeople.map((person) => (
                    <div key={person.id} className="flex items-center">
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-8">
                                <span className="text-xs">{person.name[0]}</span>
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-base-content font-medium">{person.name}</p>
                            <p className="text-sm text-base-content opacity-70">{person.username}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RightSidebar;