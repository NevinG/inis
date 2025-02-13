# Inis Open-Source

This is an open-source online implementation of the board game Inis.

Note: This project has no affiliation with Matagot or Inis.

Buy the board game [here](https://www.amazon.com/Matagot-SAS-MTGINI01-Inis-Board/dp/B089Q26FL2/ref=sr_1_2?crid=1V4BDCFBTDFQM&dib=eyJ2IjoiMSJ9.T1Sl48o5skFM8xXWFkvkRH7yIh_lzIqe8gA9WrnI0OTD-gl0MNANYuIFgok_RCzd_TC_OzjVlM9FHBCK2l3lvvwY7HfVd3XJhbtdGUplsC7T_ieEyaT8aarkVxOyYJl3kbYPHtGW1STsBMtFW1f8XjZ8Y76cWFI34N8xLtuutbd7uRv11fwcvUSCZzAJgtig40j4THI2deJxSn5ACz99zh1kmqEay8pMIF3Lh8Qftm0co6TWnFLhPlxoxLp88hqQlaVCwQDBwPn562xPO6LMOOZwGKk9mx8hxXtvdAtLhN8.WLj0uhH-fwSTNMbMsFxu4nUqji_5Yhcu92wkQAWnwVw&dib_tag=se&keywords=inis+boardgame&qid=1720649506&sprefix=inis+boardgam%2Caps%2C115&sr=8-2).

## ⬤ I want to Contribute!

Take a look at the [issues](https://github.com/NevinG/inis/issues) to get started

## ⬤ I want to play!

This project is under development.


List of Decisions Made:
 - Should disable a card if you don't have the ability to properly play it

Current TODOS (✅/❌)(goal date):

# Cards

Implement all Action Cards:
 - Bard ✅
 - Citadel ✅
 - Conquest ✅
 - Craftsmen & Peasants ✅
 - Druid ❌ (2/13)
 - Emissaries ❌ (2/14)
 - Exploration ❌ (2/15)
 - Festival ❌ (2/16)
 - Geis ❌ (2/17)
 - Master Craftsman ❌ (2/18)
 - Migration ❌ (2/19)
 - New Alliance ❌ (2/20)
 - New Clans ❌ (2/21)
 - Raid ❌ (2/22)
 - Sanctuary ❌ (2/23)
 - Scouts & Spies ❌ (2/24)
 - Warlord ❌ (2/25)(handle if not possible to play)

Implement all Advantage Cards:
 - Cove ❌ (2/26)
 - Forest ❌ (2/27)
 - Gates of Tir Na Nog ❌ (2/28)
 - Highlands ❌ (3/1)
 - Hills ❌ (3/2)
 - Iron Mine ❌ (3/3)
 - Lost Vale ❌ (3/4)
 - Meadows ❌ (3/5)
 - Misty Lands ❌ (3/6)
 - Moor ❌ (3/7)
 - Mountains ❌ (3/8)
 - Plains ❌ (3/9)
 - Salt Mine ❌ (3/10)
 - Stone Circle ❌ (3/11)
 - Swamp ❌ (3/12)
 - Valley ❌ (3/13)

Implement all Epic Tale Cards:
 - Balor's Eye ❌ (3/14)
 - Battle Frenzy ❌ (3/15)
 - The Battle of Moytura ❌ (3/16)
 - Breas' Tyranny ❌ (3/17)
 - CathBad's Word ❌ (3/18)
 - The Champion's Share ❌ (3/19)
 - Children of Dana ❌ (3/20)
 - The Dagda ❌ (3/21)
 - Dagda's Cauldron ❌ (3/22)
 - The Dagda's Club ❌ (3/23)
 - Dagda's Harp ❌ (3/24)
 - Deirdre's Beauty ❌ (3/25)
 - Diarmuid and Grainne ❌ (3/26)
 - Eriu ❌ (3/27)
 - The Fianna ❌ (3/28)
 - Kernuno's Sanctuary ❌ (3/29)
 - Lug Samildanach ❌ (3/30)
 - Lug's Spear ❌ (3/31)
 - Maeve's Wealth ❌ (4/1)
 - Manannan's Horses ❌ (4/2)
 - The Morrigan ❌ (4/3)
 - Nuada Silverhand ❌ (4/4)
 - Oengus's Ploy ❌ (4/5)
 - Ogma's Eloquence ❌ (4/6)
 - The Other World ❌ (4/7)
 - The Stone of Fal ❌ (4/8)
 - Streng's Resolve ❌ (4/9)
 - Tailtu's Land ❌ (4/10)
 - Tale of Cuchulain ❌ (4/11)
 - Tuan's Memory ❌ (4/12)

# Special Territories
- Gates of Tir Na Nog ❌ (4/12)
- Mountains ❌ (4/12)
- Stone Circle ❌ (4/12)
- Swamp ❌ (4/12)

# Features / Game Mechanics
 - Handle if a player has no clans in any territories ❌
 - Should visually show that a player has a clan in a citadel ❌
 - Add in a log so you can know what happened ❌
 - Audio queues when stuff happens? ❌


# Bug List
 - Epic Tale Manuever isn't disabled when no epic tale cards to play (maybe hide not disable).
   - Withdraw should also be disabled if no withdraw possibilities
 - When there is only one player option to attack, they should attack them.
 - Can withdraw into territory no one is chieftan of
 - When a player gets a new set of cards, and old card that was selected shouldn't be selected anymore.
 - In a clash if a player removes a geiss triskal card, they still get the option to play it (bug).
 - If you keep passing over and over again the players don't get new cards
 - Clan reserves aren't properly tracked (ex craftsmen and peasants)
 - Colors are still random for territories

# Anticipated Bugs
 - Players being able to place more clans than their reserve


