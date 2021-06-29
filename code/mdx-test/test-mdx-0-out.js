/* @jsxRuntime classic */
/* @jsx mdx */



const layoutProps = {

};
const MDXLayout = "wrapper"
export default function MDXContent({
  components,
  ...props
}) {
  return <MDXLayout {...layoutProps} {...props} components={components} mdxType="MDXLayout">
    <h1>{`Hello MDX`}</h1>
    </MDXLayout>;
}

;
MDXContent.isMDXComponent = true