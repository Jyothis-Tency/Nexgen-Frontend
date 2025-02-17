'use client'

import { useState, useRef } from 'react'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle as MuiDialogTitle,
  Divider,
  Grid2,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  Chip,
  Alert,
  styled,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  BookmarkBorder as BookmarkIcon,
  MoreHoriz as MoreIcon,
  Edit as EditIcon,
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
  FileUpload as FileUploadIcon,
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import Navbar from '../components/User/Navbar'

// Styled components
const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 2,
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    minWidth: 0,
    padding: '12px 24px',
    marginRight: theme.spacing(3),
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiTabs-flexContainer': {
    [theme.breakpoints.down('sm')]: {
      overflowX: 'auto',
      '&::-webkit-scrollbar': {
        display: 'none'
      },
    }
  }
}))

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: 'transparent',
  },
}))

const StyledCard = styled(Card)({
  border: '1px solid #E0E0E0',
  boxShadow: 'none',
  borderRadius: '8px',
})


const DialogTitle = ({ children, onClose, ...other }) => {
  return (
    <MuiDialogTitle {...other}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 1
      }}>
        <Typography variant="h6">{children}</Typography>
        {onClose && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            size="small"
            tabIndex={-1}  // Prevent focus trap issues
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>
    </MuiDialogTitle>
  )
}

export default function ProfilePage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [activeTab, setActiveTab] = useState(0)
  const [profileImage, setProfileImage] = useState('/placeholder.svg')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [skills, setSkills] = useState(['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping'])
  const [resumes, setResumes] = useState([
    { id: 1, name: 'philip Resume.pdf', dateAdded: '2024-01-15' }
  ])
  const [profileData, setProfileData] = useState({
    fullName: 'Philip Maya',
    jobTitle: 'UI/UX Designer',
    location: 'Porto, Portugal',
    employmentStatus: 'Not Employed',
    bio: 'I am a passionate UI/UX designer with 5+ years of experience creating user-centered digital experiences. Skilled in user research, wireframing, and prototyping. Always eager to tackle complex problems and turn them into elegant solutions.'
  })
  const fileInputRef = useRef(null)
  const resumeInputRef = useRef(null)

  const handleDialogClose = () => {
    setIsEditDialogOpen(false)
  }

  const activities = [
    {
      id: 1,
      company: "Meta company",
      title: "Product Designer",
      location: "Porto, Portugal (On-Site)",
      time: "Archived 5 Days Ago"
    },
    {
      id: 2,
      company: "Meta company",
      title: "Product Designer",
      location: "Porto, Portugal (On-Site)",
      time: "Archived 5 Days Ago"
    }
  ]

  const savedJobs = [
    {
      id: 1,
      company: "Google",
      title: "Senior UX Designer",
      location: "Remote",
      time: "Saved 2 Days Ago"
    },
    {
      id: 2,
      company: "Apple",
      title: "Product Designer",
      location: "California, USA (Hybrid)",
      time: "Saved 3 Days Ago"
    }
  ]

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResumeUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload only PDF files')
        return
      }
      if (resumes.length >= 5) {
        alert('Maximum 5 resumes allowed')
        return
      }
      const newResume = {
        id: Date.now(),
        name: file.name,
        dateAdded: new Date().toISOString().split('T')[0]
      }
      setResumes([...resumes, newResume])
    }
  }

  const handleRemoveResume = (id) => {
    setResumes(resumes.filter(resume => resume.id !== id))
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
      setIsAddSkillDialogOpen(false)
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleEditProfile = () => {
    setIsEditDialogOpen(true)
  }

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      {/* <Navbar /> */}

      <Container className='mt-14' maxWidth="xl" sx={{ py: 2 }}>
        <StyledCard sx={{ mx: 1 }}>
          <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Profile Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={profileImage}
                    sx={{ width: 80, height: 80 }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'white',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'white' }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </Box>
                <Box>
                  <Typography variant="h6">{profileData.fullName}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {profileData.jobTitle}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {profileData.location}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Tabs */}
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              width: '100%',
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}>
              <StyledTabs 
                value={activeTab} 
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons={false}
                aria-label="profile tabs"
              >
                <Tab label="About" />
                <Tab label="Resume" />
                <Tab label="My Activities" />
                <Tab label="Saved Jobs" />
                <Tab label="Skills" />
              </StyledTabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ py: 2 }}>
              {/* About Tab */}
              {activeTab === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" color="text.secondary">About</Typography>
                    <IconButton onClick={handleEditProfile}>
                      <EditIcon />
                    </IconButton>
                  </Box>
                  <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                    Updating your information will offer you the most relevant content
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                        <Typography color="text.secondary" variant="caption" display="block">
                          Bio
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {profileData.bio}
                        </Typography>
                      </Box>
                    <Box>
                      <Typography color="text.secondary" variant="caption" display="block">
                        Employment Status
                      </Typography>
                      <Typography variant="body2">{profileData.employmentStatus}</Typography>
                    </Box>
                    <Box>
                      <Typography color="text.secondary" variant="caption" display="block">
                        Full Name
                      </Typography>
                      <Typography variant="body2">{profileData.fullName}</Typography>
                    </Box>
                    <Box>
                      <Typography color="text.secondary" variant="caption" display="block">
                        Job Title
                      </Typography>
                      <Typography variant="body2">{profileData.jobTitle}</Typography>
                    </Box>
                    <Box>
                      <Typography color="text.secondary" variant="caption" display="block">
                        Location
                      </Typography>
                      <Typography variant="body2">{profileData.location}</Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Resume Tab */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    Resume
                  </Typography>
                  {resumes.map((resume) => (
                    <StyledCard sx={{ mb: 2 }} key={resume.id}>
                      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <FileIcon color="action" />
                          <Box>
                            <Typography variant="body2">{resume.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Added on {resume.dateAdded}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton 
                          size="small" 
                          onClick={() => handleRemoveResume(resume.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardContent>
                    </StyledCard>
                  ))}
                  {resumes.length < 5 && (
                    <StyledButton 
                      startIcon={<AddIcon />}
                      onClick={() => resumeInputRef.current?.click()}
                    >
                      Add Resume (PDF only, max 5)
                    </StyledButton>
                  )}
                  <input
                    type="file"
                    hidden
                    ref={resumeInputRef}
                    onChange={handleResumeUpload}
                    accept=".pdf"
                  />
                </Box>
              )}

              {/* Activities Tab */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    My Activities
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {activities.map((activity) => (
                      <StyledCard key={activity.id}>
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 24, height: 24 }}>M</Avatar>
                              <Typography variant="body2" color="text.secondary">
                                {activity.company}
                              </Typography>
                            </Box>
                            <Box>
                              <IconButton size="small">
                                <BookmarkIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                              <IconButton size="small">
                                <MoreIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Box>
                          </Box>
                          <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 500 }}>
                            {activity.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {activity.location}
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 5,
                                bgcolor: '#EEF4FF',
                                color: '#246BFD',
                                border: '1px solid rgba(36, 107, 253, 0.2)'
                              }}
                            >
                              {activity.time}
                            </Typography>
                          </Box>
                        </CardContent>
                      </StyledCard>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Saved Jobs Tab */}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    Saved Jobs
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {savedJobs.map((job) => (
                      <StyledCard key={job.id}>
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 24, height: 24 }}>{job.company[0]}</Avatar>
                              <Typography variant="body2" color="text.secondary">
                                {job.company}
                              </Typography>
                            </Box>
                            <Box>
                              <IconButton size="small">
                                <BookmarkIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                              <IconButton size="small">
                                <MoreIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Box>
                          </Box>
                          <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 500 }}>
                            {job.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {job.location}
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 5,
                                bgcolor: '#EEF4FF',
                                color: '#246BFD',
                                border: '1px solid rgba(36, 107, 253, 0.2)'
                              }}
                            >
                              {job.time}
                            </Typography>
                          </Box>
                        </CardContent>
                      </StyledCard>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <StyledButton endIcon={<ChevronRightIcon />}>
                      Show All Saved Jobs
                    </StyledButton>
                  </Box>
                </Box>
              )}

              {/* Skills Tab */}
              {activeTab === 4 && (
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 2,
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 1 : 0
                  }}>
                    <Typography variant="h6" color="text.secondary">
                      Skills
                    </Typography>
                    <StyledButton 
                      startIcon={<AddIcon />}
                      onClick={() => setIsAddSkillDialogOpen(true)}
                    >
                      Add Skill
                    </StyledButton>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        onDelete={() => handleRemoveSkill(skill)}
                        sx={{
                          bgcolor: '#EEF4FF',
                          color: '#246BFD',
                          '& .MuiChip-deleteIcon': {
                            color: '#246BFD',
                            '&:hover': {
                              color: '#1756D8'
                            }
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </CardContent>
        </StyledCard>
      </Container>

      {/* Edit Profile Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={handleDialogClose}
        maxWidth="md"
        aria-labelledby="edit-profile-dialog-title"
        disableRestoreFocus // Prevents focus restore issues
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: '100%'
          }
        }}
      >
        <DialogTitle 
          id="edit-profile-dialog-title"
          onClose={handleDialogClose}
        >
          Edit Profile
        </DialogTitle>
        <DialogContent>
          <Box 
            component="form" // Make it a semantic form
            noValidate // Prevent native validation
            autoComplete="off"
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 3,
              width: '100%',
              maxWidth: '600px',
              mx: 'auto',
              py: 2
            }}
          >
            <Box>
              <Typography 
                component="label" 
                htmlFor="employment-status"
                variant="caption" 
                color="text.secondary" 
                sx={{ mb: 1, display: 'block' }}
              >
                Employment Status
              </Typography>
              <TextField
                id="employment-status"
                fullWidth
                placeholder="Enter your employment status"
                value={profileData.employmentStatus}
                onChange={(e) => setProfileData({ ...profileData, employmentStatus: e.target.value })}
                size="small"
                inputProps={{
                  'aria-label': 'Employment Status'
                }}
              />
            </Box>

            <Box>
              <Typography 
                component="label" 
                htmlFor="full-name"
                variant="caption" 
                color="text.secondary" 
                sx={{ mb: 1, display: 'block' }}
              >
                Full Name
              </Typography>
              <TextField
                id="full-name"
                fullWidth
                placeholder="Enter your full name"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                size="small"
                inputProps={{
                  'aria-label': 'Full Name'
                }}
              />
            </Box>

            <Box>
              <Typography 
                component="label" 
                htmlFor="job-title"
                variant="caption" 
                color="text.secondary" 
                sx={{ mb: 1, display: 'block' }}
              >
                Job Title
              </Typography>
              <TextField
                id="job-title"
                fullWidth
                placeholder="Enter your job title"
                value={profileData.jobTitle}
                onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
                size="small"
                inputProps={{
                  'aria-label': 'Job Title'
                }}
              />
            </Box>

            <Box>
              <Typography 
                component="label" 
                htmlFor="location"
                variant="caption" 
                color="text.secondary" 
                sx={{ mb: 1, display: 'block' }}
              >
                Location
              </Typography>
              <TextField
                id="location"
                fullWidth
                placeholder="Enter your location"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                size="small"
                inputProps={{
                  'aria-label': 'Location'
                }}
              />
            </Box>

            <Box>
              <Typography 
                component="label" 
                htmlFor="bio"
                variant="caption" 
                color="text.secondary" 
                sx={{ mb: 1, display: 'block' }}
              >
                Bio
              </Typography>
              <TextField
                id="bio"
                fullWidth
                multiline
                rows={4}
                placeholder="Write something about yourself"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                inputProps={{
                  'aria-label': 'Bio'
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button 
            onClick={handleDialogClose} 
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDialogClose} 
            variant="contained"
            sx={{ textTransform: 'none' }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      {/* Add Skill Dialog */}
<Dialog 
  open={isAddSkillDialogOpen} 
  onClose={() => setIsAddSkillDialogOpen(false)}
  maxWidth="sm"
  aria-labelledby="add-skill-dialog-title"
  disableRestoreFocus
  PaperProps={{
    sx: {
      borderRadius: 2,
      width: '100%'
    }
  }}
>
  <DialogTitle 
    id="add-skill-dialog-title"
    onClose={() => setIsAddSkillDialogOpen(false)}
  >
    Add New Skill
  </DialogTitle>
  <DialogContent>
    <Box 
      component="form"
      noValidate
      autoComplete="off"
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%',
        maxWidth: '400px',
        mx: 'auto',
        py: 2
      }}
    >
      <Box>
        <Typography 
          component="label" 
          htmlFor="new-skill"
          variant="caption" 
          color="text.secondary" 
          sx={{ mb: 1, display: 'block' }}
        >
          Skill Name
        </Typography>
        <TextField
          id="new-skill"
          fullWidth
          placeholder="Enter skill name"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          size="small"
          inputProps={{
            'aria-label': 'New Skill'
          }}
        />
      </Box>
    </Box>
  </DialogContent>
  <DialogActions sx={{ 
    p: 3, 
    borderTop: '1px solid',
    borderColor: 'divider'
  }}>
    <Button 
      onClick={() => setIsAddSkillDialogOpen(false)} 
      color="inherit"
      sx={{ textTransform: 'none' }}
    >
      Cancel
    </Button>
    <Button 
      onClick={handleAddSkill} 
      variant="contained"
      sx={{ textTransform: 'none' }}
    >
      Add Skill
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  )
}