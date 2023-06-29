import * as Yup from "yup";

export const ValidationSchemaOrganization = () => {
  const schema = Yup.object().shape({
    cnpj: Yup.string()
      .required("Digite um CNPJ")
      .min(14, "Digite um CNPJ válido")
      .max(14, "Digite um CNPJ válido"),
    companyName: Yup.string().required("Digite o nome do credor"),
    commertialName: Yup.string().required("Digite um nome comercial"),
    country: Yup.string().required("Digite o nome do País"),
    postalCode: Yup.string()
      .required("Digite um CEP")
      .min(8, "Digite um CEP válido")
      .max(8, "Digite um CEP válido"),
    state: Yup.string()
      .required("Digite um estado")
      .min(2, "Digite um estado válido")
      .max(2, "Digite um estado válido"),
    city: Yup.string().required("Digite o nome da cidade"),
  });
  return schema;
};

export const ValidationSchemaPolicy = () => {
  const schema = Yup.object().shape({
    description: Yup.string().required("Digite um nome"),
    interestRate: Yup.number().required("Digite uma taxa de juros"),
    interestMonthly: Yup.number().required("Digite o juros ao mês"),
    feeRate: Yup.number().required("feeRate"),
    debtAgeStart: Yup.number().required("Quantidade de dias de início"),
  });
  return schema;
};
