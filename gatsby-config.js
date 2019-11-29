module.exports = {
  siteMetadata: {
    title: 'Gatsby and GraphCMS',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-postcss',
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Roboto`,
            variants: [`300`, `400`, `500`, `600`, `700`]
          },
        ],
      },
    },
    {
      resolve: "gatsby-source-graphql",
      options: {
        // This type will contain remote schema Query type
        typeName: "GCMS",
        // This is field under which it's accessible
        fieldName: "gcms",
        // Url to query from
        url: "https://api-euwest.graphcms.com/v1/cjm7tab4c04ro019omujh708u/master",
      },
    },
    'gatsby-plugin-offline',
  ],
}