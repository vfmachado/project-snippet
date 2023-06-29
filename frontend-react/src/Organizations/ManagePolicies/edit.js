import React, { useEffect, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import ReactLoading from "react-loading";
import { FaAngleLeft } from "react-icons/fa";

// Components
import InputFormik from "../../../../components/InputFormik";
import InputNumberFormatFormik from "../../../../components/InputNumberFormatFormik";
import SelectFormik from "../../../../components/SelectFormik";

// Context
import { useOrganizations } from "../../../../contexts/Organizations/useOrganizations";

// Validation
import { ValidationSchemaPolicy } from "../ValidationSchema";

const OrganizationsManagePoliciesEdit = () => {
  const history = useHistory();
  const { state } = useLocation();
  const { organization } = state;

  const {
    loaderOrganizations,
    loaderStoreOrganizations,
    getOneOrganizationPolicy,
    policy,
    updatePolicy,
  } = useOrganizations();

  const initialValues = {
    description: policy?.description,
    interestRate: policy?.interestRate,
    interestType: policy?.interestType,
    interestMonthly: policy?.interestMonthly,
    feeRate: policy?.feeRate,
    debtAgeStart: policy?.debtAgeStart,
    debtAgeEnd: policy?.debtAgeEnd,
  };

  const interestTypeOpts = [
    { id: "SIMPLE", name: "Simples" },
    { id: "COMPOUND", name: "Composto" },
  ];

  const handleUpdatePolicy = useCallback(
    async (values) => {
      await updatePolicy(organization?.id, organization?.policyId, values);
    },
    [updatePolicy, organization?.id, organization?.policyId]
  );

  useEffect(() => {
    getOneOrganizationPolicy(organization?.id, organization?.policyId);
  }, [getOneOrganizationPolicy, organization?.id, organization?.policyId]);

  return (
    <>
      {loaderOrganizations ? (
        <div>
          <ReactLoading
            className="m-auto"
            type="cylon"
            color="#6b6af7"
            height={48}
            width={52}
          />
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-header">
                {" "}
                Editar {organization?.policyName}
              </div>
              <div className="card-body shadow-sm">
                <Formik
                  enableReinitialize
                  initialValues={initialValues}
                  validationSchema={ValidationSchemaPolicy}
                  onSubmit={handleUpdatePolicy}
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
                              defaultValue={{
                                id: policy.interestType,
                                name:
                                  policy.interestType === "SIMPLE"
                                    ? "Simples"
                                    : "Composto",
                              }}
                              placeholder="Selecione um tipo de juros"
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

                        <div className="col-lg-3 mb-4">
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

                        <div className="col-lg-3 mb-4">
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

                        <div className="col-lg-3 mb-4">
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

                        <div className="col-lg-3 mb-4">
                          <label
                            htmlFor="isActive"
                            className="fs-6 fw-lighter mb-1"
                          >
                            <small>STATUS</small>
                          </label>
                          <div className="input-group">
                            <SelectFormik
                              props={props}
                              fieldName="isActive"
                              defaultValue={{
                                id: policy.isActive,
                                description: policy.isActive
                                  ? "ATIVADO"
                                  : "DESATIVADO",
                              }}
                              placeholder="Selecione um status"
                              getOptionLabel={(option) => option.description}
                              getOptionValue={(option) => option.id}
                              options={[
                                { id: false, description: "DESATIVADO" },
                                { id: true, description: "ATIVADO" },
                              ]}
                            />
                          </div>
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
                        <div className="d-flex justify-content-between">
                          <button
                            type="button"
                            className="btn border-secondary text-secondary mt-4 px-4"
                            onClick={() => history.goBack()}
                          >
                            <FaAngleLeft /> Voltar
                          </button>
                          <button
                            type="submit"
                            className="btn bg-purple text-white mt-4 px-4"
                          >
                            Atualizar
                          </button>
                        </div>
                      )}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrganizationsManagePoliciesEdit;
