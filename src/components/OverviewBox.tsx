interface OverviewBoxProps {
  label: string
  text: string
  icon: string
}

export default function OverviewBox({ label, text, icon }: OverviewBoxProps) {
  return (
    <div className="overview-box__detail">
      <svg className="overview-box__icon">
        <use xlinkHref={`/img/icons.svg#icon-${icon}`} />
      </svg>
      <span className="overview-box__label">{label}</span>
      <span className="overview-box__text">{text}</span>
    </div>
  )
}
