import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBuilding, FaPenSquare } from "react-icons/fa";

// Components
import MuiDatatableCustom from "../../../../components/MuiDatatable";

// Context
import { useOrganizations } from "../../../../contexts/Organizations/useOrganizations";

import { OrganizationsPath } from "../../../../routes/Config";

const OrganizationsList = () => {
  const {
    loaderOrganizations,
    errorOrganizations,
    listOrganizations,
    getAllOrganizations,
  } = useOrganizations();

  // TABLE COLUMNS
  const columns = [
    {
      name: "companyName",
      label: "Nome",
      options: {
        filter: true,
      },
    },
    {
      name: "commertialName",
      label: "Nome comercial",
      options: {
        filter: true,
      },
    },
    {
      name: "segmentType",
      label: "Tipo",
      options: {
        filter: true,
      },
    },
    {
      name: "isActive",
      label: "Status",
      options: {
        customBodyRender: (value, tableMeta) => (
          <p className="text-secondary">
            {value ? (
              <span className="badge bg-success-quitei">Ativo</span>
            ) : (
              <span className="badge bg-secondary">Desativado</span>
            )}
          </p>
        ),
      },
    },
    {
      name: "id",
      label: "Taxas",
      options: {
        customBodyRender: (value, tableMeta) => (
          <div className="pb-2">
            <Link
              to={{
                pathname: `/${OrganizationsPath}/gerenciar-taxas`,
                state: {
                  organization: {
                    id: value,
                    name: tableMeta.rowData[0],
                  },
                },
              }}
              className="text-purple"
            >
              <small className="fw-bold text-center">
                GERENCIAR <br /> TAXAS
              </small>
            </Link>
          </div>
        ),
      },
    },
    {
      name: "id",
      label: "Usuários",
      options: {
        customBodyRender: (value, tableMeta) => (
          <div className="pb-2">
            <Link
              to={{
                pathname: `/${OrganizationsPath}/gerenciar-usuarios`,
                state: {
                  organization: {
                    id: value,
                    name: tableMeta.rowData[0],
                  },
                },
              }}
              className="text-purple"
            >
              <small className="fw-bold text-center">
                GERENCIAR <br /> USUÁRIOS
              </small>
            </Link>
          </div>
        ),
      },
    },
    {
      name: "id",
      label: "Ações",
      options: {
        customBodyRender: (value, tableMeta) => (
          <div className="pb-2">
            <Link
              to={`/${OrganizationsPath}/${value}/edit`}
              className="text-warning"
            >
              <small className="fw-bold">
                <FaPenSquare /> EDITAR
              </small>
            </Link>
          </div>
        ),
      },
    },
  ];

  useEffect(() => {
    getAllOrganizations();
  }, [getAllOrganizations]);

  return (
    <>
      <Link to={`/${OrganizationsPath}/add`}>
        <button className="btn btn-sm bg-success-quitei text-white mb-4 fw-bold">
          <FaBuilding /> Adicionar Credor
        </button>
      </Link>
      <MuiDatatableCustom
        title="Lista de credores"
        columns={columns}
        values={listOrganizations}
        loader={loaderOrganizations}
        error={errorOrganizations}
        pagination={false}
      />
    </>
  );
};

export default OrganizationsList;
