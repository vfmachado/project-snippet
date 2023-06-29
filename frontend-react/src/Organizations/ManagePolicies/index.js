import React, { useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import { FaPenSquare } from "react-icons/fa";
import ReactLoading from "react-loading";

// Components
import MuiDatatableCustom from "../../../../components/MuiDatatable";
import InputFormik from "../../../../components/InputFormik";
import InputNumberFormatFormik from "../../../../components/InputNumberFormatFormik";
import SelectFormik from "../../../../components/SelectFormik";

// Context
import { useOrganizations } from "../../../../contexts/Organizations/useOrganizations";

// Utils
import { OrganizationsPath } from "../../../../routes/Config";

// Validation
import { ValidationSchemaPolicy } from "../ValidationSchema";

const OrganizationsManagePolicies = () => {
  const { state } = useLocation();
  const { organization } = state;

  const {
    loaderOrganizations,
    loaderStoreOrganizations,
    errorOrganizations,
    listOrganizationPolicies,
    getOrganizationPolicies,
    addPolicyToOrganization,
  } = useOrganizations();

  const initialValues = {
    description: "",
    interestRate: "",
    interestType: "SIMPLE",
    interestMonthly: "",
    feeRate: "",
    debtAgeStart: "",
    debtAgeEnd: "",
  };

  const interestTypeOpts = [
    {
      id: "SIMPLE",
      name: "Simples",
    },
    {
      id: "COMPOUND",
      name: "Composto",
    },
  ];

  // TABLE COLUMNS
  const columns = [
    {
      name: "description",
      label: "Descrição",
      options: {
        filter: true,
      },
    },
    {
      name: "interestRate",
      label: "Taxa de Juros",
      options: {
        filter: true,
      },
    },
    {
      name: "interestType",
      label: "Tipo",
      options: {
        filter: true,
        customBodyRender: (value) =>
          value === "SIMPLE" ? "Simples" : "Composto",
      },
    },
    {
      name: "isActive",
      label: "Status",
      options: {
        customBodyRender: (value) => (
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
      label: "Ações",
      options: {
        customBodyRender: (value, tableMeta) => (
          <div className="pb-2">
            <Link
              to={{
                pathname: `/${OrganizationsPath}/gerenciar-taxas/taxa/edit`,
                state: {
                  organization: {
                    id: organization?.id,
                    policyId: value,
                    policyName: tableMeta.rowData[0],
                  },
                },
              }}
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

  const handleAddPolicy = useCallback(
    async (values, { resetForm }) => {
      await addPolicyToOrganization(organization?.id, values);
      resetForm();
      await getOrganizationPolicies(organization?.id);
    },
    [addPolicyToOrganization, getOrganizationPolicies, organization?.id]
  );

  useEffect(() => {
    getOrganizationPolicies(organization?.id);
  }, [getOrganizationPolicies, organization?.id]);

  return (
    <>
      <div className="row">
        <div className="col-lg-12 mb-4">
          <div className="card shadow-sm">
            <div className="card-header">
              {" "}
              Adicionar taxas para {organization?.name}
            </div>
            <div className="card-body shadow-sm">
              <Formik
                initialValues={initialValues}
                onSubmit={handleAddPolicy}
                validationSchema={ValidationSchemaPolicy}
              >
                {(props) => (
                  <Form>
                    <div className="row">
                      <div className="col-lg-5 mb-4">
                        <label
                          htmlFor="description"
                          className="fs-6 fw-lighter mb-1"
                        >
                          <small>Descrição</small>
                        </label>
                        <InputFormik
                          props={props}
                          type="text"
                          fieldName="description"
                          placeholder="Digite um nome"
                        />
                      </div>

                      <div className="col-lg-3 mb-4">
                        <label
                          htmlFor="interestType"
                          className="fs-6 fw-lighter mb-1"
                        >
                          <small>Tipo de juros</small>
                        </label>

                        <div className="input-group has-validation">
                          <SelectFormik
                            props={props}
                            fieldName="interestType"
                            placeholder="Selecione uma opção"
                            defaultValue={interestTypeOpts[0]}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                            options={interestTypeOpts}
                          />
                        </div>
                      </div>

                      <div className="col-lg-2 mb-4">
                        <label
                          htmlFor="interestRate"
                          className="fs-6 fw-lighter mb-1"
                        >
                          <small>Taxa de juros</small>
                        </label>
                        <InputNumberFormatFormik
                          props={props}
                          fieldName="interestRate"
                          placeholder="Taxa de juros"
                        />
                      </div>

                      <div className="col-lg-2 mb-4">
                        <label
                          htmlFor="interestMonthly"
                          className="fs-6 fw-lighter mb-1"
                        >
                          <small>Juros ao mês</small>
                        </label>
                        <InputNumberFormatFormik
                          props={props}
                          fieldName="interestMonthly"
                          placeholder="Juros ao mês"
                        />
                      </div>

                      <div className="col-lg-4 mb-4">
                        <label
                          htmlFor="feeRate"
                          className="fs-6 fw-lighter mb-1"
                        >
                          <small>feeRate</small>
                        </label>
                        <InputNumberFormatFormik
                          props={props}
                          fieldName="feeRate"
                          placeholder="feeRate"
                        />
                      </div>

                      <div className="col-lg-4 mb-4">
                        <label
                          htmlFor="debtAgeStart"
                          className="fs-6 fw-lighter mb-1"
                        >
                          <small>Quantidade de dias</small>
                        </label>
                        <InputNumberFormatFormik
                          props={props}
                          fieldName="debtAgeStart"
                          placeholder="Quantidade de dias de início"
                          format="###"
                        />
                      </div>

                      <div className="col-lg-4 mb-4">
                        <label
                          htmlFor="debtAgeEnd"
                          className="fs-6 fw-lighter mb-1"
                        >
                          <small>Quantidade de dias</small>
                        </label>
                        <InputNumberFormatFormik
                          props={props}
                          fieldName="debtAgeEnd"
                          placeholder="Quantidade de dias para o fim"
                          format="###"
                        />
                      </div>
                    </div>

                    {loaderStoreOrganizations ? (
                      <ReactLoading
                        className="m-auto"
                        type="cylon"
                        color="#6b6af7"
                        height={48}
                        width={52}
                      />
                    ) : (
                      <button
                        type="submit"
                        className="btn bg-purple text-white mt-4 px-4"
                      >
                        Cadastrar
                      </button>
                    )}
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>

        <div className="col-lg-12 mb-4">
          <MuiDatatableCustom
            title={`Lista de taxas - ${organization?.name}`}
            columns={columns}
            values={listOrganizationPolicies}
            loader={loaderOrganizations}
            error={errorOrganizations}
            pagination={false}
          />
        </div>
      </div>
    </>
  );
};

export default OrganizationsManagePolicies;
