(function (c, p, y, d, u, r, w, b) {
    "use strict";
    const { ScrollView: v } = u.General,
        { FormSection: f, FormRadioRow: _, FormSwitchRow: F, FormIcon: S } = u.Forms;

    function R() {
        return w.useProxy(r.storage), React.createElement(v, null,
            React.createElement(f, { title: "Misc Settings", titleStyleType: "no_border" }),
            React.createElement(F, {
                label: "NSFW Warning",
                subLabel: "Warn when sending an NSFW image in a non-NSFW channel.",
                leading: React.createElement(S, { source: b.getAssetIDByName("ic_warning_24px") }),
                value: r.storage.nsfwwarn,
                onValueChange: function (n) { return r.storage.nsfwwarn = n }
            }),
            React.createElement(f, { title: "Default Sort", titleStyleType: "no_border" },
                Object.entries({ Best: "best", Hot: "hot", New: "new", Rising: "rising", Top: "top", Controversial: "controversial" })
                    .map(function (n) {
                        let [t, s] = n;
                        return React.createElement(_, {
                            label: t,
                            selected: r.storage.sortdefs === s,
                            onPress: function () { r.storage.sortdefs = s }
                        })
                    })
            ),
            React.createElement(f, { title: "Default Subreddit", titleStyleType: "no_border" },
                Object.entries({
                    "r/feet": "feet",
                    "r/feetishh": "feetishh",
                    "r/feetinyourface": "feetinyourface",
                    "r/feetqueens": "feetqueens",
                    "r/feettoesandsocks": "feettoesandsocks"
                }).map(function (n) {
                    let [t, s] = n;
                    return React.createElement(_, {
                        label: t,
                        selected: r.storage.subredditdef === s,
                        onPress: function () { r.storage.subredditdef = s }
                    })
                })
            )
        );
    }

    const g = d.findByProps("sendMessage", "receiveMessage"),
        A = d.findByProps("getLastSelectedChannelId"),
        N = d.findByProps("createBotMessage"),
        $ = d.findByProps("BOT_AVATARS");

    function l(n, t, s) {
        const a = n ?? A?.getChannelId?.(),
            i = N.createBotMessage({ channelId: a, content: "", embeds: s });
        i.author.username = "GotFeet";
        i.author.avatar = "GotFeet";
        $.BOT_AVATARS.FeetBot = "https://media.discordapp.net/attachments/1283072767285002341/1307009821068890163/GYLD4GSWUAAxoch.png"; // FeetBot's avatar URL

        if (typeof t === "string") {
            i.content = t;
        } else {
            Object.assign(i, t);
        }

        g.receiveMessage(a, i);
    }

    let m = [];

    m.push(p.registerCommand({
        name: "gotfeet",
        displayName: "gotfeet",
        description: "Get an image from the default subreddit.",
        displayDescription: "Get an image from the default subreddit.",
        options: [
            {
                name: "sort",
                displayName: "sort",
                description: "Changes the way Reddit sorts.",
                displayDescription: "Changes the way Reddit sorts",
                required: false,
                type: 3,
            },
            {
                name: "silent",
                displayName: "silent",
                description: "Makes it so only you can see the message.",
                displayDescription: "Makes it so only you can see the message.",
                required: false,
                type: 5,
            }
        ],
        applicationId: "-1",
        inputType: 1,
        type: 1,
        execute: async function (n, t) {
            try {
                let subreddit = r.storage.subredditdef || "feet", // Default subreddit from settings
                    sort = n.find(o => o.name === "sort")?.value || r.storage.sortdefs || "new",
                    silent = n.find(o => o.name === "silent")?.value;

                if (!["best", "hot", "new", "rising", "top", "controversial"].includes(sort)) {
                    l(t.channel.id, "Incorrect sorting type. Valid options are `best`, `hot`, `new`, `rising`, `top`, `controversial`.", []);
                    return;
                }

                let response = await fetch(`https://www.reddit.com/r/${subreddit}/${sort}.json?limit=100`).then(o => o.json());
                let post = response.data?.children?.[Math.floor(Math.random() * response.data?.children?.length)]?.data;

                let authorInfo = await fetch(`https://www.reddit.com/u/${post?.author}/about.json`).then(o => o.json());

                let embed = {
                    type: "rich",
                    title: post?.title,
                    url: `https://reddit.com${post?.permalink}`,
                    author: {
                        name: `u/${post?.author} • r/${post?.subreddit}`,
                        proxy_icon_url: authorInfo?.data.icon_img.split("?")[0],
                        icon_url: authorInfo?.data.icon_img.split("?")[0]
                    },
                    image: {
                        proxy_url: post?.url_overridden_by_dest?.replace(/.gifv$/g, ".gif") || post?.url?.replace(/.gifv$/g, ".gif"),
                        url: post?.url_overridden_by_dest?.replace(/.gifv$/g, ".gif") || post?.url?.replace(/.gifv$/g, ".gif"),
                        width: post?.preview?.images?.[0]?.source?.width,
                        height: post?.preview?.images?.[0]?.source?.height
                    },
                    color: 0xf4b8e4
                };

                if (silent ?? true) {
                    l(t.channel.id, "", [embed]);
                } else {
                    g.sendMessage(t.channel.id, { content: post?.url_overridden_by_dest ?? post?.url });
                }
            } catch (error) {
                y.logger.log(error);
                l(t.channel.id, "ERROR 😭😭😭 Check debug logs!! 🥺🥺🥺", []);
            }
        }
    }));

    const M = R,
        B = function () { r.storage.nsfwwarn ??= true; r.storage.sortdefs ??= "new"; r.storage.subredditdef ??= "feet"; },
        j = function () { for (const n of m) n(); };

    return c.onLoad = B, c.onUnload = j, c.settings = M, c;
})({}, vendetta.commands, vendetta, vendetta.metro, vendetta.ui.components, vendetta.plugin, vendetta.storage, vendetta.ui.assets);
