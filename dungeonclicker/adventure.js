var adventureBonusCoin = 0;
var adventureMultiplier = 0;
var quests = new Array();
var heroicQuests = new Array();
var hQC = 0;
var hideBGHandle;
var showBGHandle;

function initAdventurePanel() {
	$("#btnAdventure").hover(function() {
		if (dC["options"]["ShowAdventureLight"] == false) return;
		$("#light").css("opacity", 1);
	}, function() {
		$("#light").css("opacity", 0);
	});
	
	$("#btnAdventure").mousedown(function() {
		if (hasBuff("Boots of Alacrity")) adventure();
	});
	
	$("#btnAdventure").mouseup(function() {
		adventure();
	});
}

function showAdventurePanel() {
	$("#bg-texture").css("background-color", "#753EBB");
}

function updateAdventureMultiplier() {
	adventureBonusCoin = 0;
	adventureMultiplier = 1;
	
	if (hasBuff("Horseshoe")) adventureBonusCoin += 1;
	if (hasBuff("Rabbit's Foot")) adventureBonusCoin += 1;
	if (hasBuff("Nazar")) adventureBonusCoin += 1;
	if (hasBuff("Lucky Hand")) adventureBonusCoin += 1;
	if (hasBuff("Coin Charm")) adventureBonusCoin += 1;
	if (hasBuff("Golden Rose Clover")) adventureBonusCoin += 5;

	if (hasBuff("Brooch of the Prosperous Adventurer")) adventureMultiplier += 0.05;
	if (hasBuff("Pendant of the Prosperous Adventurer")) adventureMultiplier += 0.1;
	if (hasBuff("Necklace of the Prosperous Adventurer")) adventureMultiplier += 0.15;
	if (hasBuff("Gloves of the Prosperous Adventurer")) adventureMultiplier += 0.2;
	if (hasBuff("Cape of the Prosperous Adventurer")) adventureMultiplier += 0.25;
}

function adventure() {
	var coin = randomBetween(1, 3) + adventureBonusCoin;
	
	if (hasBuff("Verdant Bead of the Windwalker")) coin += randomBetween(Math.ceil(multiplyNumbers(income, 0.005)), Math.ceil(multiplyNumbers(income, 0.01)));
	if (hasBuff("Amber Bead of the Sandwalker")) coin += randomBetween(Math.ceil(multiplyNumbers(income, 0.005)), Math.ceil(multiplyNumbers(income, 0.01)));
	if (hasBuff("Crimson Bead of the Flamewalker")) coin += randomBetween(Math.ceil(multiplyNumbers(income, 0.01)), Math.ceil(multiplyNumbers(income, 0.025)));
	if (hasBuff("Azure Bead of the Rainwalker")) coin += randomBetween(Math.ceil(multiplyNumbers(income, 0.01)), Math.ceil(multiplyNumbers(income, 0.025)));
	
	if (adventureMultiplier > 1) coin = Math.ceil(multiplyNumbers(coin, adventureMultiplier));
	
	var heroicProbability = 0;
	if (hasBuff("Book of Aresius")) heroicProbability++;
	if (hasBuff("Book of Antonidas")) heroicProbability++;
	
	if (randomBetween(1, 100) <= heroicProbability && hQC >= 10) {
		hQC = 0;
		coin = multiplyNumbers(coin, 10);
		if (heroicQuests.length < 1) {
			generateHeroicQuests();
		}
		quest = heroicQuests.splice(Math.floor(Math.random() * heroicQuests.length), 1);
	}
	else {
		hQC++;
		if (quests.length < 1) {
			generateQuests();
		}
		quest = quests.splice(Math.floor(Math.random() * quests.length), 1);
	}
	
	quest = quest[0].replace("#coin#", coin.addCommas() + "<span class='symbol'>g</span>");
	
	toLog(quest);
	addCoin(coin);
	
	// Spawn particles
	var p = randomBetween(1, 3);
	if (hasBuff("Golden Rose Clover") && dC["options"]["AdditionalParticles"] == true) p += 3;
	
	spawnParticles("coin", p);
}

function generateHeroicQuests() {
	heroicQuests = new Array();
	if (hasBuff("Book of Aresius")) {
		heroicQuests.push("You <span class='heroic'>open the Gate of Hope</span>! You earn <span class='coin'>#coin#</span>.");
		heroicQuests.push("You <span class='heroic'>defeat the Krakhon army</span>! You earn <span class='coin'>#coin#</span>.");
		heroicQuests.push("You <span class='heroic'>destroy the Chalice of Agony</span>! You earn <span class='coin'>#coin#</span>.");
		heroicQuests.push("You <span class='heroic'>discover the Elvenpath</span>! You find <span class='coin'>#coin#</span>.");
		heroicQuests.push("You <span class='heroic'>unchain Arwald's soul</span>! You earn <span class='coin'>#coin#</span>.");
		heroicQuests.push("You <span class='heroic'>protect Village Lanterne</span>! You earn <span class='coin'>#coin#</span>.");
		heroicQuests.push("You <span class='heroic'>vanquish the Blackbird Nation</span>! You earn <span class='coin'>#coin#</span>.");
		heroicQuests.push("You <span class='heroic'>face the Thing that Should Not Be</span>! You earn <span class='coin'>#coin#</span>.");
	}
	if (hasBuff("Book of Antonidas")) {
		heroicQuests.push("You <span class='heroic'>cleanse the world of the Corruption</span>! You earn <span class='coin'>#coin#</span>.");
		heroicQuests.push("You <span class='heroic'>slay the Ender Dragon</span>! You earn <span class='coin'>#coin#</span>.");
		heroicQuests.push("You <span class='heroic'>slay the Czar Dragon</span>! You earn <span class='coin'>#coin#</span>.");
		heroicQuests.push("You <span class='heroic'>close the Dark Portal</span>! You earn <span class='coin'>#coin#</span>.");
		heroicQuests.push("You <span class='heroic'>explore Turtle Rock</span>! You find <span class='coin'>#coin#</span>.");
		heroicQuests.push("You <span class='heroic'>climb the Endless Tower</span>! You earn <span class='coin'>#coin#</span>.");
		heroicQuests.push("You <span class='heroic'>raid the Veriil dungeon</span>! You earn <span class='coin'>#coin#</span>.");
		heroicQuests.push("You <span class='heroic'>mend the leg of a black mare</span>! You earn <span class='coin'>#coin#</span>.");
	}
}

function generateQuests() {
		for (var i = 0; i < 15; i++) {
			quests.push("You <span class='xp'>slay " + getRandom(races) + " " + getRandom(classes) + "</span>! You earn <span class='coin'>#coin#</span>.");
			quests.push("You <span class='xp'>slay a " + getRandom(prefixes) + " " + getRandom(pests) + "</span>! You earn <span class='coin'>#coin#</span>.");
			quests.push("You <span class='xp'>gather some " + getRandom(gatherables) + " for " + getRandom(questgivers) + "</span>! You earn <span class='coin'>#coin#</span>.");
		}
		quests.push("You <span class='xp'>conquer your fear of " + getRandom(fears) + "</span>! You earn <span class='coin'>#coin#</span>.");
}

function getRandom(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
