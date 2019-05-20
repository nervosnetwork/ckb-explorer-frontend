class TypeScriptSerializer
  include FastJsonapi::ObjectSerializer

  attributes :args, :code_hash
end
