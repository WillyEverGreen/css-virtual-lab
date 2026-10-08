# Message Authentication Code (MAC)

## Group
Group C

## Experiment ID
EXP03

## Navigation Title
Message Authentication Code (MAC)

## Short Description
Verify data integrity and authenticity using symmetric secret keys.

## Folder
/experiments/mac/

## Entry File
index.html

## Expected Navigation Link
/experiments/mac/

## Required Libraries
None

## Input
Message and Secret Key

## Output
Authentication Tag

## Theory Summary
Message Authentication Codes (MAC) employ symmetric secret keys to compute fixed-size authentication tags over arbitrary messages. The sender and receiver share a secret key K. The sender computes T = MAC(K, M) and transmits M || T. The receiver verifies that MAC(K, M) matches T, ensuring data origin authenticity and detecting unauthorized modification in transit.
