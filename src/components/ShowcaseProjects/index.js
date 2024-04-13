import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import ProjectCard from '../ProjectCard'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ShowcaseProjects extends Component {
  state = {
    activeId: 'ALL',
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectsData()
  }

  getProjectsData = async () => {
    const {activeId} = this.state
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const projectsApiUrl = `https://apis.ccbp.in/ps/projects?category=${activeId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(projectsApiUrl, options)
    const fetchedData = await response.json()
    console.log(fetchedData)

    if (response.ok) {
      const updatedProjects = fetchedData.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.img_url,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        projectsList: updatedProjects,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <ul className="projects-holder">
        {projectsList.map(eachProject => (
          <ProjectCard key={eachProject.id} projectDetails={eachProject} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="bold-text">Oops! Something Went Wrong</h1>
      <p className="text">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.getProjectsData()}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" />
    </div>
  )

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onSelectingOption = event => {
    this.setState(
      {
        activeId: event.target.value,
      },
      this.getProjectsData,
    )
  }

  renderSelectOptions = () => (
    <select className="select-option" onChange={this.onSelectingOption}>
      {categoriesList.map(eachOption => (
        <option value={eachOption.id} key={eachOption.id} className="option">
          {eachOption.displayText}
        </option>
      ))}
    </select>
  )

  render() {
    const {activeId} = this.state
    console.log(activeId)
    return (
      <div className="bg-container">
        <Header />
        {this.renderSelectOptions()}
        {this.renderView()}
      </div>
    )
  }
}

export default ShowcaseProjects
