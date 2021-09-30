import React from 'react'

import { StyledSection, Container, Grid, Image, Subheading } from './styles'


export const NFTs = () => {
  return (
    <StyledSection>
      <Container>
        <Subheading>ETH</Subheading>
        <Grid>
          <Image src="/nfts/CoolCat9524.png" />
          <Image src="/nfts/gcg2096.png" />
          <Image src="/nfts/GutterRat226.png" />
          <Image src="/nfts/SupDuck1342.png" />
          <Image src="/nfts/SupDuck5149.png" />
          <Image src="/nfts/SupDuck6812.png" />
          <div style={{
            background: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Image style={{
              width: '70%'
            }} src="/nfts/MoonCat12989.png" />
          </div>
          <Image src="/nfts/CrypToadz6501.png" />
          <Image src="/nfts/CrypToadz6923.png" />
        </Grid>

        <Subheading>Tezos</Subheading>
        <Grid>
          <Image src="/nfts/hen1.jpeg" />
          <Image src="/nfts/hen2.gif" />
          <Image src="/nfts/hen3.jpeg" />
          <Image src="/nfts/hen4.png" />
          <Image src="/nfts/hen5.jpeg" />
          <Image src="/nfts/hen6.jpeg" />
          <Image src="/nfts/hen7.jpeg" />
          <Image src="/nfts/hen8.gif" />
        </Grid>
      </Container>
    </StyledSection>
  )
}
