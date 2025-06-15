import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Sidebar from '../Components/Sidebar';
import { Container, Row, Col } from 'react-bootstrap';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Container fluid>
        <Row>
          <Col md={2} className="p-0">
            <Sidebar />
          </Col>
          <Col md={10} className="p-4">
            <main>{children}</main>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default Layout;