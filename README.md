# feat[Product Creation]: Implement Factory Pattern for Product API

# To successfully POST a new product, the following headers are required:
1. `x-api-key` - This is the API key.
2. `x-client-id` - This is the shop ID, checkable in the Shop Collection.
3. `authorization` - This is the access token.

For instance, the headers will be as follows:
- `x-api-key`: `a7ed9b15d0508bc291513f23c343fd5a84e576d0d2554592e7dfb0e8dea4dc1920b92a50d1aaa3e5f10cfb9e153736596fb456d02f900d2b266aeae3d4d34ae3`
- `x-client-id`: `65eeb0cbaf21eea8516fd27e`
- `authorization`: (access token here)

The result of the operation should resemble the following structure:
```json
{
  "message": "OK",
  "status": 200,
  "metadata": {
    "shop": {
      "_id": "65eeb0cbaf21eea8516fd27e",
      "name": "ninhvh10",
      "email": "ninhvh11gmail.com"
    },
    "tokens": {
      "accessToken": (access token here),
      "refreshToken": (refresh token here)
    }
  }
}
