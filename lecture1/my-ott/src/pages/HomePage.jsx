import { Box } from '@mui/material'
import Header from '../components/layout/Header.jsx'
import HeroSection from '../components/HeroSection.jsx'
import ContentSection from '../components/ContentSection.jsx'
import DetailSection from '../components/DetailSection.jsx'
import RecommendSection from '../components/RecommendSection.jsx'
import Footer from '../components/layout/Footer.jsx'
import { heroContent, mainContents, detailContent, recommendedContents } from '../data/contents.js'

const HomePage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100svh' }}>
      <Header />
      <HeroSection
        title={heroContent.title}
        description={heroContent.description}
        bannerImage={heroContent.bannerImage}
      />
      <ContentSection title="주요 콘텐츠" items={mainContents} />
      <DetailSection
        title={detailContent.title}
        description={detailContent.description}
        meta={detailContent.meta}
        bannerImage={detailContent.bannerImage}
      />
      <RecommendSection items={recommendedContents} />
      <Footer />
    </Box>
  )
}

export default HomePage
