# 365-MPPs_3_Client-Side-Prediction

## Info
    This will be a project spanning multiple days.

## Day 1 (2021-01-03)
    - time it took: ~10 hours, because I spent a lot of time trying out typescript, web pack, parcel, and template projects, but ended up going vanilla js and socket and no Phaser at all
    - networked player movement

## Day 2 (2021-01-05)
    - time it took: ~2 hours
    - naive interpolation by interpolating the other players' position from their current position to the last received position. I call this "naive" because if these is latency between packets, then although the movement is smooth, it still jumps.

## Day 3 (2021-01-06)
    - time it took: ~1.25 hours
    - added a slider that controls the client's rate at which to send position payloads to server

## Day 4 (2021-01-07)
    - time it took: ~1 hours
    - added message that calculates latency between C (Client) & S (Server), S & C, and RTT (Round Trip Time)

## Day 5 (2021-01-08)
    - time it took: ~1 hours
    - added pseudo code for a prediction algorithm
