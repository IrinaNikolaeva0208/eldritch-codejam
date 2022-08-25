import ancientsData from "./data/ancients.js";
import cards from "./data/mythicCards/index.js";

const pack_stack = {
    brown: [],
    green: [],
    blue: [],
    add_arr: function (color, item) {
        this[color].push(...item);
    },
    add: function (color, item) {
        this[color].push(item);
    },
    remove: function (color) {
        return this[color].pop();
    },
    sort_by_rand: function (color) {
        this[color].sort(() => Math.random() - 0.5);
    },
};
const cards_num = {};
const play_box = document.querySelector(".play-box");
const play_button = document.querySelector("button");
const ancients = document.querySelectorAll(".ancient");
const diffs = document.querySelectorAll(".difficulty-box span");
const pack_elem = document.querySelector(".pack");
const cur_card = document.querySelector(".current-card");
const circles = document.querySelectorAll(".circle");

const create_subpack = (subpack, condition) => {
    for (let card in cards)
        for (let c in cards[card])
            if (condition) {
                if (cards[card][c].difficulty != condition)
                    subpack.push(cards[card][c]);
            } else subpack.push(cards[card][c]);
};

const fill_packstack = (cards_ness, color, arr_ness) => {
    while (pack_stack[color].length < cards_ness) {
        const temp_card = arr_ness[Math.floor(Math.random() * arr_ness.length)];
        if (!pack_stack[color].includes(temp_card))
            pack_stack.add(color, temp_card);
    }
};

const create_notextra_pack = (cards_num, subpack) => {
    for (let color of ["green", "brown", "blue"]) {
        const cards_ness =
            cards_num.first[color + "Cards"] +
            cards_num.second[color + "Cards"] +
            cards_num.third[color + "Cards"];
        let cards_color = subpack.filter((elem) =>
            elem.cardFace.includes(color)
        );
        fill_packstack(cards_ness, color, cards_color);
    }
};

const create_extra_pack = (cards_num, subpack) => {
    subpack.sort((a, b) =>
        a.difficulty == "easy" && a.difficulty != b.difficulty ? -1 : 1
    );
    for (let color of ["green", "brown", "blue"]) {
        const cards_diff = subpack
            .slice(
                0,
                subpack.findIndex((elem) => elem.difficulty == "normal")
            )
            .filter((elem) => elem.cardFace.includes(color));
        const cards_ness =
            cards_num.first[color + "Cards"] +
            cards_num.second[color + "Cards"] +
            cards_num.third[color + "Cards"];
        if (cards_diff.length <= cards_ness) {
            pack_stack.add_arr(color, cards_diff);
            const cards_normal = subpack
                .slice(subpack.findIndex((elem) => elem.difficulty == "normal"))
                .filter((elem) => elem.cardFace.includes(color));
            fill_packstack(cards_ness, color, cards_normal);
            pack_stack.sort_by_rand(color);
        } else fill_packstack(cards_ness, color, cards_diff);
    }
};

for (let an of ancients)
    an.addEventListener("click", (event) => {
        if (!event.target.classList.contains("chosen-anc")) {
            for (let item of ancients)
                if (item.classList.contains("chosen-anc"))
                    item.classList.remove("chosen-anc");
            event.target.classList.add("chosen-anc");
        }
    });

for (let dif of diffs)
    dif.addEventListener("click", (event) => {
        if (!event.target.classList.contains("chosen-diff")) {
            for (let item of diffs)
                if (item.classList.contains("chosen-diff"))
                    item.classList.remove("chosen-diff");
            event.target.classList.add("chosen-diff");
        }
    });

play_button.addEventListener("click", () => {
    play_box.classList.remove("hidden");
    cur_card.style = "background:none";
    pack_stack.blue = [];
    pack_stack.brown = [];
    pack_stack.green = [];
    const chosen_ancient = document.querySelector(".chosen-anc");
    const chosen_diff = document.querySelector(".chosen-diff");
    cards_num.first = ancientsData[chosen_ancient.id].firstStage;
    cards_num.second = ancientsData[chosen_ancient.id].secondStage;
    cards_num.third = ancientsData[chosen_ancient.id].thirdStage;
    for (let stage in cards_num)
        for (let circle of circles)
            if (circle.classList.contains(stage))
                circle.textContent =
                    cards_num[stage][circle.classList[1] + "Cards"];
    let subpack = [];
    if (chosen_diff.id == "extra-easy") {
        create_subpack(subpack, "hard");
        create_extra_pack(cards_num, subpack);
    } else if (chosen_diff.id == "easy") {
        create_subpack(subpack, "hard");
        create_notextra_pack(cards_num, subpack);
    } else if (chosen_diff.id == "hard") {
        create_subpack(subpack, "easy");
        create_notextra_pack(cards_num, subpack);
    } else if (chosen_diff.id == "extra-hard") {
        create_subpack(subpack, "easy");
        create_extra_pack(cards_num, subpack);
    } else {
        create_subpack(subpack);
        create_notextra_pack(cards_num, subpack);
    }
});

pack_elem.addEventListener("click", () => {
    let colors = ["green", "brown", "blue"];
    for (let stage in cards_num) for (let col in cards_num[stage]);
});
