import { Box } from '@mui/material'
import Header from '../components/layout/Header.jsx'
import HeroSection from '../components/HeroSection.jsx'
import MembershipBanner from '../components/MembershipBanner.jsx'
import ContentSection from '../components/ContentSection.jsx'
import DetailSection from '../components/DetailSection.jsx'
import RecommendCarousel from '../components/RecommendCarousel.jsx'
import Footer from '../components/layout/Footer.jsx'
import {
  heroContent,
  membershipPlans,
  mainContents,
  detailContent,
  serviceHighlights,
  recommendedContents,
} from '../data/contents.js'

const HomePage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100svh' }}>
      <Header />
      <HeroSection
        title={heroContent.title}
        description={heroContent.description}
        bannerImage={heroContent.bannerImage}
      />
      <MembershipBanner plans={membershipPlans} />
      <ContentSection title="주요 콘텐츠" items={mainContents} />
      <DetailSection
        title={detailContent.title}
        description={detailContent.description}
        meta={detailContent.meta}
        bannerImage={detailContent.bannerImage}
        services={serviceHighlights}
      />
      <RecommendCarousel items={recommendedContents} />
      <Footer />
    </Box>
  )
}

export default HomePage
