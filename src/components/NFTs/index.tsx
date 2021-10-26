import React from 'react'

import { StyledSection, Container, Grid, Image, Subheading } from './styles'


export const NFTs = () => {
  return (
    <StyledSection>
      <Container>
        <Subheading>ETH</Subheading>
        <Grid>
          <Image isSold={true} src="/nfts/gcg2096.png" />
          <Image src="/nfts/GutterRat226.png" />
          <Image src="/nfts/gutter_pigeon_1734.png" />
          <Image src="/nfts/SupDuck1342.png" />
          <Image src="/nfts/SupDuck5149.png" />
          <Image src="/nfts/SupDuck6812.png" />
          <Image src="/nfts/kingfrog11342.png" />
          <Image src="/nfts/kingfrog15149.png" />
          <Image src="/nfts/kingfrog16812.png" />

          <Image src="/nfts/choadz6501.jpeg" />
          <Image src="/nfts/choadz6923.jpeg" />
      <Image src="/nfts/CrypToadz6501.png" />
          <Image src="/nfts/CrypToadz6923.png" />
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

          <Image src="/nfts/doodle2550.png" />
          <Image src="/nfts/doodle2551.png" />
          <Image src="/nfts/doodle2552.png" />
          <Image src="/nfts/doodle2553.png" />
          <Image src="/nfts/creature4371.jpeg" />
          <Image isSold={true} src="/nfts/CoolCat9524.png" />
          <Image src="Archmagus_Eric_of_the_Capital.png" />
          <Image src="Hadrien_of_Cuckoo_Land.png" />

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
          <Image src="/nfts/hen10.jpeg" />
          <Image src="/nfts/hen9.png" />
          <Image src="/nfts/Window_Still_Life_084.gif" />
        </Grid>
      </Container>
    </StyledSection>
  )
}
