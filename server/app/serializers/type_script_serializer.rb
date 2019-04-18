class TypeScriptSerializer
  include FastJsonapi::ObjectSerializer

  attributes :args, :binary_hash
end
