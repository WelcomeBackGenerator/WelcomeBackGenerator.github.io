import collections
import glob
import json
import random

# itemId

# 0:itemLabel
# 1:birthYear
# 2:deathYear
# 3:sitelinks
# 4:isHuman
# 5:isFrench
# 6:imgUrl

items = collections.defaultdict(lambda: [None, None, None, None, False, False, None])

for filename in glob.glob('data_raw/*.json'):
    with open(filename) as fi:
        data = json.load(fi)
    for item in data:
        assert item['item'].startswith('http://www.wikidata.org/entity/')
        itemId = item['item'].split('/')[-1]
        assert itemId.startswith('Q')

        label = item['itemLabel'][0].upper() + item['itemLabel'][1:]
        if items[itemId][0] is not None:
            assert label == items[itemId][0]
        items[itemId][0] = label

        if 'dateOfBirth' in item:
            birthYear = int(item['dateOfBirth'][:4])
            assert 1970 <= birthYear <= 2023
            if items[itemId][1] is not None:
                items[itemId][1] = min(birthYear, items[itemId][1])
            else:
                items[itemId][1] = birthYear

        if 'dateOfDeath' in item:
            deathYear = int(item['dateOfDeath'][:4])
            assert 1970 <= deathYear <= 2023
            if items[itemId][2] is not None:
                items[itemId][2] = max(deathYear, items[itemId][2])
            else:
                items[itemId][2] = deathYear

        siteLinks = int(item['sitelinks'])
        if items[itemId][3] is not None:
            assert items[itemId][3] == siteLinks
        items[itemId][3] = siteLinks

        isHuman = '/human' in filename
        items[itemId][4] |= isHuman

        if 'itemNationality' in item:
            if item['itemNationality'] == 'http://www.wikidata.org/entity/Q142':
                items[itemId][5] = True

        if items[itemId][6] is None:
            items[itemId][6] = item['image']

birthcnt = collections.Counter(x[1] for x in items.values() if x[1] is not None)
deathcnt = collections.Counter(x[2] for x in items.values() if x[2] is not None)
            
for itemId in items:
    assert items[itemId][0] is not None
    assert None not in items[itemId][3:]

combinations = 0
for year in birthcnt:
    print(year, birthcnt[year] * deathcnt[year])
    combinations += birthcnt[year] * deathcnt[year]

print(f'{len(items)} items loaded')
print(f'{combinations} combinations')

def generate(items):
    year = random.randint(1970, 2023)
    deadId = random.choice([x for x in items if items[x][2] == year])
    bornId = random.choice([x for x in items if items[x][1] == year])
    print(f'{year} : {items[deadId][0]} / {items[bornId][0]}')

vals = sorted(items.values(), key=lambda x:x[0])
with open('data.txt', 'w') as fo:
    for it in vals:
        fo.write(f'            {json.dumps(it)},\n')
