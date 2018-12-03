def count_letters(id=''):
    # chars = id.split('')
    counts = {}
    for char in id:
        if char in counts:
            counts[char] = counts[char] + 1
        else:
            counts[char] = 1
    # print('id = {}, counts = {}'.format(id, counts))
    return counts


f = open('input.txt', 'r')

ids = [line.strip() for line in f]

f.close()

letter_counts = [count_letters(id) for id in ids]
twos = 0
threes = 0
for id_letter_count in letter_counts:
    has_two = False
    has_three = False
    for char, count in id_letter_count.items():
        has_two = has_two or count == 2
        has_three = has_three or count == 3

    twos = twos + (1 if has_two else 0)
    threes = threes + (1 if has_three else 0)

checksum = twos * threes

print('checksum: {}'.format(checksum))
