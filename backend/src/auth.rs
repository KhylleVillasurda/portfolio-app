//! JWT creation and validation helpers.

use anyhow::Result;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    /// Subject — always "admin" for this single-user portfolio
    pub sub: String,
    /// Expiry (Unix timestamp)
    pub exp: usize,
}

pub struct JwtConfig {
    encoding_key: EncodingKey,
    decoding_key: DecodingKey,
    expiry_secs: u64,
}

impl JwtConfig {
    pub fn new(secret: &str, expiry_secs: u64) -> Self {
        let key_bytes = secret.as_bytes();
        Self {
            encoding_key: EncodingKey::from_secret(key_bytes),
            decoding_key: DecodingKey::from_secret(key_bytes),
            expiry_secs,
        }
    }

    /// Issue a new JWT for the admin user.
    pub fn issue(&self) -> Result<String> {
        let exp = chrono::Utc::now()
            .checked_add_signed(chrono::Duration::seconds(self.expiry_secs as i64))
            .expect("overflow")
            .timestamp() as usize;

        let claims = Claims {
            sub: "admin".into(),
            exp,
        };
        let token = encode(&Header::default(), &claims, &self.encoding_key)?;
        Ok(token)
    }

    /// Validate and decode a JWT string. Returns `Ok(claims)` on success.
    pub fn validate(&self, token: &str) -> Result<Claims> {
        let data = decode::<Claims>(token, &self.decoding_key, &Validation::default())?;
        Ok(data.claims)
    }
}
