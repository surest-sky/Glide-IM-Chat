const HtmlApp = ({ html, className }) => {
    return <div className={className} dangerouslySetInnerHTML={{ __html: html }} ></div>;
};

export default HtmlApp;
