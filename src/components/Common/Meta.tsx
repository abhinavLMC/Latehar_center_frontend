/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import Head from 'next/head'

interface PropType {
  title: string
  description?: string
  children?: React.ReactNode
}

const Meta = ({ title, description, children }: PropType): JSX.Element => {
  // console.info(`Meta Title = ${title} \nMeta Description = ${description}`);

  // let icon
  // if (typeof window !== 'undefined' && localStorage.getItem('favicon')) {
  //   icon = localStorage.getItem('favicon.ico')
  // }

  const defaultDescription = 'Software that makes talent acquisition easier.'

  return (
    <Head>
      <title>{title ? `${title}` : ''}</title>
      <meta name="description" content={description ?? defaultDescription} />
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.png" />
      <meta name="robots" content="noindex" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="apple-touch-icon" href="/favicon.png" />
      {children}
    </Head>
  )
}

export default Meta