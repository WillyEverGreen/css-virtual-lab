# SSL/TLS Protocol Overview

## Group
Group E

## Experiment ID
EXP05

## Navigation Title
SSL/TLS Overview

## Short Description
Simulate the SSL/TLS handshake protocol and demonstrate cryptographic message sequences.

## Folder
/experiments/ssl-tls/

## Entry File
index.html

## Expected Navigation Link
/experiments/ssl-tls/

## Required Libraries
None

## Input
TLS version selection, cipher suite parameters, and application payload

## Output
Step-by-step handshake message sequence, derived session keys, and encrypted record exchange

## Theory Summary
Transport Layer Security (TLS 1.2 / TLS 1.3) establishes an authenticated, encrypted channel across an untrusted network. The handshake protocol uses Ephemeral Elliptic Curve Diffie-Hellman (ECDHE) key exchange over P-256 and X.509 certificate chains to negotiate shared master secrets without transmitting private key material, ensuring Perfect Forward Secrecy. The record protocol subsequently encrypts application traffic with authenticated ciphers like AES-GCM.
