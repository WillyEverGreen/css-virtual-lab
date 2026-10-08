# MD5 Hashing & Collisions

## Group
Group A

## Experiment ID
EXP01

## Navigation Title
MD5 Hashing & Collisions

## Short Description
Explore the MD5 message digest algorithm and demonstrate hash collisions.

## Folder
/experiments/md5/

## Entry File
index.html

## Expected Navigation Link
/experiments/md5/

## Required Libraries
None

## Input
Arbitrary length message string

## Output
128-bit hex digest

## Theory Summary
MD5 processes an arbitrary-length message by padding it to a multiple of 512 bits, appending a 64-bit length representation, and processing 512-bit blocks through 64 step operations across 4 non-linear rounds (F, G, H, I). The final 128-bit state across registers A, B, C, D forms the message digest.
