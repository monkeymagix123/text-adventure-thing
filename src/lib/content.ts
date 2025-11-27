export const gameData: Record<string, unknown> = {
    states: [
        {
            id: "home",
            title: "Home",
            description: "Welcome to the game",
            options: [
                {
                    action: "Play",
                    state: "start",
                },
            ],
        },
        {
            id: "start",
            title: "Start",
            description: "You wake up in a dark room. There's not quite anything to do at the moment, so you might as well explore.",
            options: [
                {
                    action: "Explore",
                    state: "start",
                },
                {
                    action: "Look around",
                    state: "start",
                },
                {
                    action: "Sit down",
                    state: "sat-down",
                },
                {
                    action: "Exit game",
                    state: "home",
                },
            ],
        },
        {
            id: "sat-down",
            title: "Sat Down",
            description: "You sit down, expecting to feel the cold floor beneath your feet. But instead, you find yourself in another dark room. There's not quite anything to do at the moment, so you might as well explore.",
            copy_options: "start",
        },
    ],
};