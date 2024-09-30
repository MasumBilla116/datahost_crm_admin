import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {


  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => App,
        enhanceComponent: (Component) => Component,
      })
      return await Document.getInitialProps(ctx)
  }

  
  render() {
    return (
      <Html>
        <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords"
            content="managebeds,hotel-management,hotel,hospitality,datahost-it" />
        <meta name="description" content="Managebeds hospitality management solution for all property types. 2022 Best PMS, Best Hotel Software, Top 10 Hotelier’s Choice, and more." />
        <meta name="robots" content="noindex,nofollow" />
        {/*<title>Managebeds</title>*/}

        
        <link rel="canonical" href="http://194.233.78.193/" />

        <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/favicon.png" />
        <link rel="stylesheet" href="/assets/libs/apexcharts/dist/apexcharts.css" />
        <link href="/assets/libs/jvectormap/jquery-jvectormap.css" rel="stylesheet" />
   

        {/* Data table Plugin */}
        <link href="/assets/extra-libs/datatables.net-bs4/css/dataTables.bootstrap4.css"rel="stylesheet"/>
        <link rel="stylesheet" type="text/css" href="/assets/extra-libs/datatables.net-bs4/css/responsive.dataTables.min.css"/>
        {/* End */}

        {/* bootstrap switch button */}
        <link rel="stylesheet" type="text/css" href="/assets/libs/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css"/>

        <link href="/dist/css/style.min.css" rel="stylesheet" />

        {/* custom css */}
        <link href="/dist/css/custom.min.css" rel="stylesheet" />
        <link href="/dist/css/responsive.css" rel="stylesheet" />

        {/* bootstrap cdn */}
        <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css" />


        </Head>
        <body>
          <Main />
          <NextScript />

        <script src="/assets/libs/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
        <script src="/assets/libs/jquery/dist/jquery.min.js"></script>

       
        <script src="/dist/js/app.min.js"></script>
        <script src="/dist/js/app.init.js"></script>
    
        <script src="/dist/js/app-style-switcher.js"></script>

        <script src="/assets/libs/perfect-scrollbar/dist/perfect-scrollbar.jquery.min.js"></script>
        <script src="/assets/extra-libs/sparkline/sparkline.js"></script>


        <script src="/dist/js/waves.js"></script>

        <script src="/dist/js/sidebarmenu.js"></script>

        <script src="/dist/js/feather.min.js"></script>

        <script src="/dist/js/custom.min.js"></script>

        {/* ContactList Page plugin */}
        <script src="/dist/js/pages/contact/contact.js"></script>

        {/* Datatable Plugin */}
        <script src="/assets/extra-libs/datatables.net/js/jquery.dataTables.min.js"></script>
        <script src="/assets/extra-libs/datatables.net-bs4/js/dataTables.responsive.min.js"></script>
        <script src="/dist/js/pages/datatable/datatable-basic.init.js"></script>

        {/* bootstrap switch button */}
        <script src="/assets/libs/bootstrap-switch/dist/js/bootstrap-switch.min.js"></script>

        <script src="/assets/libs/apexcharts/dist/apexcharts.min.js"></script>
        <script src="/dist/js/pages/dashboards/dashboard2.js"></script>

        </body>
      </Html>
    )
  }
}

export default MyDocument


