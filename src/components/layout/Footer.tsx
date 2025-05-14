import { Container, Typography, Box, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from '@/components/ui/Logo';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote'; // For TikTok

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/#pricing' },
        { label: 'Examples', href: '/#examples' },
        { label: 'API', href: '/api' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'Tutorials', href: '/tutorials' },
        { label: 'Blog', href: '/blog' },
        { label: 'Support', href: '/support' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Twitter', icon: <TwitterIcon fontSize="small" />, href: '#' },
    { name: 'Instagram', icon: <InstagramIcon fontSize="small" />, href: '#' },
    { name: 'YouTube', icon: <YouTubeIcon fontSize="small" />, href: '#' },
    { name: 'TikTok', icon: <MusicNoteIcon fontSize="small" />, href: '#' },
  ];

  return (
    <Box 
      component="footer" 
      sx={{ 
        py: { xs: 8, md: 12 }, 
        backgroundColor: '#0A0A0A',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '1px',
          background: 'linear-gradient(90deg, rgba(30, 215, 96, 0), rgba(30, 215, 96, 0.5), rgba(30, 215, 96, 0))',
        },
                        }}
                      >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            flexWrap: 'wrap',
            gap: { xs: 6, md: 4 },
                    }}
                  >
          {/* Company info section */}
          <Box 
            sx={{ 
              flex: { xs: '1 1 100%', md: '1 1 30%' },
              maxWidth: { md: '30%' },
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Box sx={{ mb: 3 }}>
                <Logo />
    </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 350, lineHeight: 1.6 }}>
                Turn your ideas into viral videos in seconds with AI-powered video generation. Create engaging content for social media without any editing skills.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                {socialLinks.map((social) => (
                  <motion.div
                    key={social.name}
                    whileHover={{ y: -3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <MuiLink
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: 'text.secondary',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      {social.icon}
                    </MuiLink>
                  </motion.div>
                ))}
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                © {currentYear} ReelGenius. All rights reserved.
              </Typography>
            </motion.div>
          </Box>
          
          {/* Links sections */}
          <Box 
            sx={{ 
              flex: { xs: '1 1 100%', md: '1 1 60%' },
              maxWidth: { md: '60%' },
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 4, md: 2 },
            }}
          >
            {footerLinks.map((section, sectionIndex) => (
              <Box 
                key={section.title}
                sx={{ 
                  flex: { xs: '1 1 45%', sm: '1 1 30%', md: '1 1 auto' },
                  minWidth: { xs: '150px', md: '140px' },
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + (sectionIndex * 0.1) }}
                  viewport={{ once: true }}
                >
                  <Typography 
                    variant="subtitle2" 
                    color="text.primary" 
                    sx={{ 
                      mb: 3, 
                      fontWeight: 600,
                      fontSize: '1rem',
                      position: 'relative',
                      display: 'inline-block',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-8px',
                        left: 0,
                        width: '24px',
                        height: '2px',
                        backgroundColor: 'primary.main',
                        borderRadius: '2px',
                      },
                    }}
                  >
                    {section.title}
                  </Typography>
                  
                  <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                    {section.links.map((link) => (
                      <Box 
                        component="li" 
                        key={link.label} 
                        sx={{ mb: 2 }}
                      >
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        >
                          <Link href={link.href} passHref>
                            <MuiLink
                              underline="none"
                              color="text.secondary"
                              sx={{
                                transition: 'all 0.2s ease',
                                '&:hover': { 
                                  color: 'primary.main',
                                },
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Box 
                                component="span" 
                                sx={{ 
                                  width: 0,
                                  height: 1,
                                  backgroundColor: 'primary.main',
                                  display: 'inline-block',
                                  mr: 1,
                                  transition: 'all 0.2s ease',
                                  opacity: 0,
                                  '.MuiLink-root:hover &': {
                                    width: 8,
                                    opacity: 1,
                                  }
                                }} 
                              />
                              {link.label}
                            </MuiLink>
                          </Link>
                        </motion.div>
                      </Box>
                    ))}
                  </Box>
                </motion.div>
              </Box>
            ))}
            
            {/* Newsletter section */}
            <Box 
              sx={{ 
                flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 auto' },
                minWidth: { xs: '100%', sm: '200px' },
                mt: { xs: 2, md: 0 },
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Typography 
                  variant="subtitle2" 
                  color="text.primary" 
                  sx={{ 
                    mb: 3, 
                    fontWeight: 600,
                    fontSize: '1rem',
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-8px',
                      left: 0,
                      width: '24px',
                      height: '2px',
                      backgroundColor: 'primary.main',
                      borderRadius: '2px',
                    },
                  }}
                >
                  Stay Updated
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Get notified about new features and updates.
                </Typography>
                
                <Box 
                  component="form" 
                  sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 1,
                  }}
                >
                  <Box
                    component="input"
                    placeholder="Your email"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      color: 'white',
                      fontSize: '0.875rem',
                      outline: 'none',
                      flex: 1,
                      '&:focus': {
                        borderColor: 'primary.main',
                      },
                    }}
                  />
                  <Box
                    component="button"
                    type="submit"
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'black',
                      fontWeight: 600,
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Subscribe
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Box>
        </Box>
        
        {/* Bottom section with additional links */}
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'center' },
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            mt: 8,
            pt: 4,
            gap: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Made with ❤️ by the ReelGenius team
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex',
              gap: 3,
            }}
          >
            <Link href="/privacy" passHref>
              <MuiLink
                underline="hover"
                color="text.secondary"
                sx={{
                  fontSize: '0.75rem',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Privacy Policy
              </MuiLink>
            </Link>
            <Link href="/terms" passHref>
              <MuiLink
                underline="hover"
                color="text.secondary"
                sx={{
                  fontSize: '0.75rem',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Terms of Service
              </MuiLink>
            </Link>
            <Link href="/cookies" passHref>
              <MuiLink
                underline="hover"
                color="text.secondary"
                sx={{
                  fontSize: '0.75rem',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Cookie Policy
              </MuiLink>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;