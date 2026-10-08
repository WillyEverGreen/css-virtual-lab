# SHA-1 Cryptographic Hash

## Group
Group B

## Experiment ID
EXP02

## Navigation Title
SHA-1 Cryptographic Hash

## Short Description
Explore the Secure Hash Algorithm 1 internal compression function.

## Folder
/experiments/sha1/

## Entry File
index.html

## Expected Navigation Link
/experiments/sha1/

## Required Libraries
None

## Input
Arbitrary length message string

## Output
160-bit hex digest

## Theory Summary
SHA-1 (Secure Hash Algorithm 1) processes messages in 512-bit blocks using a Merkle-Damgard architecture. The message is padded to 448 mod 512, followed by a 64-bit big-endian length. Each block is expanded from 16 to 80 words through circular bit rotation and processed through 80 step operations across 5 internal state registers (A, B, C, D, E) yielding a 160-bit digest.
