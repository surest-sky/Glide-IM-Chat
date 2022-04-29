const HtmlApp = ({ html, className }) => {
    return <div className={className} dangerouslySetInnerHTML={{ __html: html }} color={'white'}></div>;
};

export default HtmlApp;
