import './index.css'

const ProjectCard = props => {
  const {projectDetails} = props
  const {id, name, imageUrl} = projectDetails

  return (
    <li className="project-card">
      <img src={imageUrl} alt="name" className="project-img" />
      <p className="name">{name}</p>
    </li>
  )
}

export default ProjectCard
