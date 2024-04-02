#ifndef ARGON2D_GATE_H__
#define ARGON2D_GATE_H__

#include <stdint.h>

// Bitcreds: version = 0x10, m_cost = 16000.

void argon2d_bcrs_hash( void *state, const void *input );

#endif

