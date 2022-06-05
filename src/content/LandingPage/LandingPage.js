import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
} from 'carbon-components-react';
import { InfoSection, InfoCard } from '../../components/Info';
import Globe32 from '@carbon/icons-react/lib/globe/32';
import PersonFavorite32 from '@carbon/icons-react/lib/person--favorite/32';
import Application32 from '@carbon/icons-react/lib/application/32';

const props = {
  tabs: {
    selected: 0,
    role: 'navigation',
  },
  tab: {
    role: 'presentation',
    tabIndex: 0,
  },
};

const LandingPage = () => {
  return (
    <div className="bx--grid bx--grid--full-width landing-page">
      <div className="bx--row landing-page__banner">
        <div className="bx--col-lg-16">
          <Breadcrumb noTrailingSlash aria-label="Page navigation">
            <BreadcrumbItem>
              <a href="/">Inicio</a>
            </BreadcrumbItem>
          </Breadcrumb>
          <h1 className="landing-page__heading">
            Herramientas para tu Upskill
          </h1>
        </div>
      </div>
      <div className="bx--row landing-page__r2">
        <div className="bx--col bx--no-gutter">
          <Tabs {...props.tabs} aria-label="Tab navigation">
            <Tab {...props.tab} label="¿Qué es?">
              <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
                <div className="bx--row landing-page__tab-content">
                  <div className="bx--col-md-4 bx--col-lg-7">
                    <h2 className="landing-page__subheading">
                      ¿Qué es esta aplicación?
                    </h2>
                    <p className="landing-page__p">
                      Este es un sistema desarrollado por IBM Technology Mexico
                      para integrar herramientas técnicas para tu entrenamiento.
                      Usa el menú para acceder a las funciones de esta
                      aplicación.
                    </p>
                    <Button>Aprende más</Button>
                  </div>
                  <div className="bx--col-md-4 bx--offset-lg-1 bx--col-lg-8">
                    <img
                      className="landing-page__illo"
                      src={`${process.env.PUBLIC_URL}/tab-illo.png`}
                      alt="Carbon illustration"
                    />
                  </div>
                </div>
              </div>
            </Tab>
            <Tab {...props.tab} label="Diseño">
              <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
                <div className="bx--row landing-page__tab-content">
                  <div className="bx--col-lg-16">
                    Esta aplicación aprovecha el lenguaje de diseño Open Source
                    llamada Carbon. Con ella podemos crear rápidamente
                    aplicaciones con estándares muy altos de experiencia de
                    usuario.
                  </div>
                </div>
              </div>
            </Tab>
            <Tab {...props.tab} label="Autores">
              <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
                <div className="bx--row landing-page__tab-content">
                  <div className="bx--col-lg-16">
                    Aplicación creada por José Luis Rodríguez y Alfredo López.
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
      <InfoSection heading="Principios" className="landing-page__r3">
        <InfoCard
          heading="Compartir para crecer"
          body="La idea de esta aplicación es que sea una base de aprendizaje para el upskill de todos en IBM Technology Mexico y no solo para el team técnico sino de ventas."
          icon={<PersonFavorite32 />}
        />
        <InfoCard
          heading="Demostrar para ganar"
          body="Una buena historia, una buena articulación técnica y alineación con las necesidades de nuestros clientes crean la fórmula para ganar el mercado."
          icon={<Globe32 />}
        />
      </InfoSection>
    </div>
  );
};

export default LandingPage;
