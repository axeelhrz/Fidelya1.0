import { Container, Grid, Typography, Box, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

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

  return (
    <Box component="footer" sx={{ py: 8, backgroundColor: '#0A0A0A' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Logo />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 300 }}>
              Turn your ideas into viral videos in seconds with AI-powered video generation.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} ReelGenius. All rights reserved.
            </Typography>
          </Grid>

          {footerLinks.map((section) => (
            <Grid item xs={6} sm={4} md={2} key={section.title}>
              <Typography variant="subtitle2" color="text.primary" sx={{ mb: 2, fontWeight: 600 }}>
                {section.title}
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                {section.links.map((link) => (
                  <Box component="li" key={link.label} sx={{ mb: 1 }}>
                    <Link href={link.href} passHref>
                      <MuiLink
                        underline="hover"
                        color="text.secondary"
                        sx={{ 
                          '&:hover': { color: 'primary.main' },
                          fontSize: '0.875rem'
                        }}
                      >
                        {link.label}
                      </MuiLink>
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}

          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="subtitle2" color="text.primary" sx={{ mb: 2, fontWeight: 600 }}>
              Connect
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              {['Twitter', 'Instagram', 'YouTube', 'TikTok'].map((social) => (
                <Box component="li" key={social} sx={{ mb: 1 }}>
                  <MuiLink
                    href="#"
                    underline="hover"
                    color="text.secondary"
                    sx={{ 
                      '&:hover': { color: 'primary.main' },
                      fontSize: '0.875rem'
                    }}
                  >
                    {social}
                  </MuiLink>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;