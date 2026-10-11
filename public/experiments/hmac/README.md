# HMAC Authentication and Verification

## Group
Group D

## Experiment ID
EXP04

## Navigation Title
HMAC Authentication

## Short Description
Generate and verify Keyed-Hash Message Authentication Codes and inspect padding.

## Folder
/experiments/hmac/

## Entry File
index.html

## Expected Navigation Link
/experiments/hmac/

## Required Libraries
None

## Input
Plaintext message string and shared secret key

## Output
256-bit hexadecimal HMAC authentication tag

## Theory Summary
HMAC (Hash-based Message Authentication Code) combines a cryptographic hash function like SHA-256 with a shared secret key via a two-pass nested construction: H((K' XOR opad) || H((K' XOR ipad) || M)). The inner pad (0x36) and outer pad (0x5C) protect against length extension vulnerabilities inherent in Merkle-Damgard hash structures, providing guaranteed message integrity and sender authentication without encrypting the message payload.
