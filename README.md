PebbleLock
==========
PebbleLock is a pair of apps for Android smartphone and Pebble smartwatch that demonstrate a security proof-of-concept. The apps implement a secure method of establishing continuous authenticity on the phone while paired with the specified smartwatch.

The phone is set to lock itself if a secure connection with the smartwatch cannot be verified. We achieved this using the Secure Remote Password (SRP) protocol for a key exchange and use that shared key to encode hash-based message authentication codes (HMACs) of the current time. The smartphone requests these HMACs from the smartwatch at a set time interval, then locks itself if it cannot verify the sent HMAC.
