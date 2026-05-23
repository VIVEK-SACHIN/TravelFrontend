import { useTheme } from '../context/ThemeContext'

export default function Footer() {
  const { theme } = useTheme()

  return (
    <footer className="footer">
      <div className="footer__logo">
        <img src={theme.footerLogo} alt="Natour logo" />
      </div>
      <ul className="footer__nav">
        <li>
          <a href="#about">About us</a>
        </li>
        <li>
          <a href="#apps">Download apps</a>
        </li>
        <li>
          <a href="#guide">Become a guide</a>
        </li>
        <li>
          <a href="#careers">Careers</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>
      <p className="footer__copyright">
        &copy; TravelAndTour. Built as a React frontend for the TravelAndTour API.
      </p>
    </footer>
  )
}
