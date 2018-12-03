f = open('input.txt', 'r')

deltas = [int(line.strip()) for line in f]

f.close()

print('final frequency = {}'.format(sum(deltas)))

freq = 0
seen = {}
while True:
    for delta in deltas:
        freq = freq + delta
        if freq in seen:
            print('repeating frequency = {}'.format(freq))
            exit()
        seen[freq] = True
