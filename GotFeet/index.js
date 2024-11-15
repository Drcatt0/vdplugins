(function (c, p, y, d, u, r, w, b) {
    "use strict";
    const { ScrollView: v } = u.General,
        { FormSection: f, FormRadioRow: _, FormSwitchRow: F, FormIcon: S } = u.Forms;

    function R() {
        return w.useProxy(r.storage), React.createElement(v, null,
            React.createElement(f, { title: "Misc Settings", titleStyleType: "no_border" }),
            React.createElement(F, {
                label: "NSFW Warning",
                subLabel: "Warn when sending an NSFW image in a non NSFW channel.",
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
        i.author.username = "FeetBot";
        i.author.avatar = "FeetBot";
        $.BOT_AVATARS.FeetBot = "https://cdn.discordapp.com/embed/avatars/0.png"; // FeetBot's avatar URL

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
        description: "Get an image from r/feet",
        displayDescription: "Get an image from r/feet",
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
                let s = n.find(o => o.name === "sort")?.value,
                    i = n.find(o => o.name === "silent")?.value;

                if (typeof s === "undefined") s = r.storage.sortdefs;

                if (!["best", "hot", "new", "rising", "top", "controversial"].includes(s)) {
                    l(t.channel.id, "Incorrect sorting type. Valid options are `best`, `hot`, `new`, `rising`, `top`, `controversial`.", []);
                    return;
                }

                let e = await fetch(`https://www.reddit.com/r/feet/${s}.json?limit=100`).then(o => o.json());
                e = e.data?.children?.[Math.floor(Math.random() * e.data?.children?.length)]?.data;

                let h = await fetch(`https://www.reddit.com/u/${e?.author}/about.json`).then(o => o.json());

                if (i ?? true) {
                    l(t.channel.id, "", [
                        {
                            type: "rich",
                            title: e?.title,
                            url: `https://reddit.com${e?.permalink}`,
                            author: {
                                name: `u/${e?.author} • r/${e?.subreddit}`,
                                proxy_icon_url: h?.data.icon_img.split("?")[0],
                                icon_url: h?.data.icon_img.split("?")[0]
                            },
                            image: {
                                proxy_url: e?.url_overridden_by_dest.replace(/.gifv$/g, ".gif") ?? e?.url.replace(/.gifv$/g, ".gif"),
                                url: e?.url_overridden_by_dest?.replace(/.gifv$/g, ".gif") ?? e?.url?.replace(/.gifv$/g, ".gif"),
                                width: e?.preview?.images?.[0]?.source?.width,
                                height: e?.preview?.images?.[0]?.source?.height
                            },
                            color: 0xf4b8e4
                        }
                    ]);
                } else {
                    g.sendMessage(t.channel.id, { content: e?.url_overridden_by_dest ?? e?.url });
                }
            } catch (error) {
                y.logger.log(error);
                l(t.channel.id, "ERROR 😭😭😭 Check debug logs!! 🥺🥺🥺", []);
            }
        }
    }));

    const M = R,
        B = function () { r.storage.nsfwwarn ??= true; r.storage.sortdefs ??= "new"; },
        j = function () { for (const n of m) n(); };

    return c.onLoad = B, c.onUnload = j, c.settings = M, c;
})({}, vendetta.commands, vendetta, vendetta.metro, vendetta.ui.components, vendetta.plugin, vendetta.storage, vendetta.ui.assets)
