import BoxSDK from 'box-node-sdk'
import { BoxClient } from 'box-typescript-sdk-gen'
import { BoxJwtAuth, JwtConfig } from 'box-typescript-sdk-gen/lib/box/jwtAuth.generated.js'
// const { BoxJwtAuth, JwtConfig } = await import('box-typescript-sdk-gen/lib/jwtAuth.generated.js')
// import { createRequire } from 'module'
// const require = createRequire(import.meta.url)
// const { BoxJwtAuth, JwtConfig } = require('box-typescript-sdk-gen/lib/jwtAuth.generated.js')
const jwt = require('jsonwebtoken');
try {
jwt.decode('')
}
catch (e) {
}

export default function HomePage() {
  async function boxGetTokenOld() {
    'use server'

    const boxSDK = BoxSDK.getPreconfiguredInstance(
      JSON.parse(atob(process.env.JWT_CONFIG_BASE_64 || '')),
    )
    const boxClient = boxSDK.getAppAuthClient('user', process.env.ADMIN_USER_ID)

    const token = await boxClient.exchangeToken(
      ['item_preview'],
      `https://api.box.com/2.0/files/${process.env.BOX_FILE_ID}`,
    )

    console.log({ token })

    return token.accessToken
  }

  async function boxGetTokenNew() {
    'use server'

    console.log(atob(process.env.JWT_CONFIG_BASE_64 || ''))
    const boxJwtConfig = JwtConfig.fromConfigJsonString(atob(process.env.JWT_CONFIG_BASE_64 || ''))
    const boxJwtAuth = await new BoxJwtAuth({ config: boxJwtConfig })
      .asUser(process.env.ADMIN_USER_ID || '')

    // Retrieve a token to avoid error: "No access token is available. Make an
    // API call to retrieve a token before calling this method."
    await boxJwtAuth.retrieveToken()

    const client = new BoxClient({
      auth: boxJwtAuth,
    })
    console.log(await client.users.getUserMe())

    // const token = await boxJwtAuth.downscopeToken(
    //   ['item_preview'],
    //   `https://api.box.com/2.0/files/${process.env.BOX_FILE_ID}`,
    // )

    // console.log({ token })

    // return token.accessToken
  }

  return (
    <main>
      <form action={boxGetTokenOld}>
        <button type="submit">box-node-sdk</button>
      </form>

      <form action={boxGetTokenNew}>
        <button type="submit">box-typescript-sdk-gen</button>
      </form>
    </main>
  );
}
